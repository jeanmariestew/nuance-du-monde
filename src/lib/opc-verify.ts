import puppeteer, { Browser, Page } from 'puppeteer';

interface OPCVerifyResult {
  isValid: boolean;
  firstName?: string;
  lastName?: string;
  certificateNumber?: string;
  error?: string;
}

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  return browserInstance;
}

async function navigateWithCloudflareBypass(
  page: Page,
  url: string
): Promise<void> {
  // Ajouter un user agent pour éviter les blocages Cloudflare
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  );

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 45000,
    });
  } catch (error) {
    // Attendre un peu et réessayer en cas de timeout
    await new Promise(r => setTimeout(r, 2000));
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
  }
}

export async function verifyOPCCertificate(
  firstName: string,
  lastName: string,
  certificateNumber: string
): Promise<OPCVerifyResult> {
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    page.setDefaultNavigationTimeout(45000);
    page.setDefaultTimeout(30000);

    // Naviguer au site OPC avec bypass Cloudflare
    await navigateWithCloudflareBypass(
      page,
      'https://pes.opc.gouv.qc.ca/certificat/recherche/?lang=fr'
    );

    // Attendre que la page soit interactive
    await new Promise(r => setTimeout(r, 2000));

    // Chercher les champs du formulaire
    const inputs = await page.$$('input[type="text"], input[name*="nom"], input[name*="prenom"], input[name*="certif"], input[name*="number"]');

    if (inputs.length < 3) {
      // Essayer une approche alternative: chercher tous les inputs
      const allInputs = await page.$$('input');

      if (allInputs.length >= 3) {
        // Remplir les 3 premiers inputs supposés être: prénom, nom, numéro
        await allInputs[0].type(firstName, { delay: 100 });
        await allInputs[1].type(lastName, { delay: 100 });
        await allInputs[2].type(certificateNumber, { delay: 100 });
      } else {
        throw new Error('Formulaire introuvable');
      }
    } else {
      // Remplir avec les inputs trouvés
      await inputs[0].type(firstName, { delay: 100 });
      await inputs[1].type(lastName, { delay: 100 });
      await inputs[2].type(certificateNumber, { delay: 100 });
    }

    // Soumettre le formulaire
    const submitBtn = (await page.$('button[type="submit"]')) as any;

    if (submitBtn) {
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 3000));
    } else {
      // Presser Enter dans le dernier input
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 3000));
    }

    // Vérifier les résultats
    const pageContent = await page.content();

    // Chercher des messages d'erreur ou d'absence
    if (
      pageContent.includes('aucun') ||
      pageContent.includes('not found') ||
      pageContent.includes('introuvable') ||
      pageContent.includes('aucune') ||
      pageContent.includes('erreur')
    ) {
      return {
        isValid: false,
        firstName,
        lastName,
        certificateNumber,
        error: 'Permis non trouvé dans le registre OPC',
      };
    }

    // Si on arrive ici, considérer comme valide
    return {
      isValid: true,
      firstName,
      lastName,
      certificateNumber,
    };

  } catch (error: any) {
    console.error('OPC Verification error:', error.message);

    // En cas d'erreur, retourner non-vérifié mais pas bloquer le login
    return {
      isValid: false,
      firstName,
      lastName,
      certificateNumber,
      error: 'Vérification OPC indisponible',
    };
  } finally {
    if (page) {
      await page.close();
    }
  }
}
