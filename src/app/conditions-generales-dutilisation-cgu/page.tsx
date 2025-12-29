import Link from "next/link";
import type { Metadata } from "next";

const HERO_IMAGE =
  "https://blogs.nuancedumonde.com/wp-content/uploads/2024/05/CGV2.jpg";
const ACCENT_COLOR = "#d9a900";

export const metadata: Metadata = {
  title: "Conditions Générales d’Utilisation - Nuance du Monde",
  description:
    "Conditions Générales d’Utilisation (CGU) de Nuance du Monde : règles d'utilisation du site et informations légales.",
};

const navLinks = [
  {
    label: "Condition Général de Vente",
    href: "/conditions-generales-de-vente-cgv",
  },
  {
    label: "Condition Général d’Utilisation",
    href: "/conditions-generales-dutilisation-cgu",
  },
  {
    label: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
  },
];

type AccordionItem = {
  number: string;
  title: string;
  html: string;
};

const accordionItems: AccordionItem[] = [
  {
    number: "1",
    title: "Votre passeport pour une expérience utilisateur optimale.",
    html: `
      <p>L'utilisation des sites édités et développés par Nuance du Monde implique votre engagement à respecter les présentes conditions. Nous vous conseillons vivement de consulter attentivement nos conditions générales d'utilisation avant toute utilisation.</p>
      <p>Bienvenue sur le site web www.nuancedumonde.com dont ITTS Inc. est le propriétaire et administrateur. Les présentes modalités d'utilisation (ci-après dénommées les Conditions générales d'Utilisation) forment un accord légal entre vous et ITTS concernant l'accès et l'utilisation du site web.</p>
      <p>En visitant ce site web, en le parcourant ou en l'utilisant de quelque manière que ce soit, vous reconnaissez avoir lu et compris ces conditions. Vous acceptez d'être soumis à celles-ci ainsi qu'à toutes les lois et à tous les règlements applicables. En cas de désaccord avec ces termes, nous vous demandons de vous abstenir d'utiliser ce site web.</p>
    `,
  },
  {
    number: "2",
    title: "Présentation des services et des produits du site Nuance du Monde",
    html: `
      <p>Nuance du monde, une nouvelle marque commerciale issue de Stew Travel, est une plateforme de création de voyages à la carte à travers le monde. L’utilisation du site est à la fois libre et gratuite.</p>
      <p>Le site a été conçu pour faire des réservations des voyages sur-mesure en fonction des propositions d'itinéraires modifiables, avec l'aide de nos experts. En naviguant sur le site, vous aurez la possibilité de parcourir les divers circuits proposés.</p>
      <p>Nuance du monde offre aux utilisateurs l'accès gratuit aux informations et/ou aux services suivants :</p>
      <ul>
        <li>Conseils de voyage et informations détaillées sur nos produits.</li>
        <li>Création des offres de voyage à la carte, pour individuels et en groupes,</li>
        <li>Mise en ligne des clichés de voyage propre à chaque destination.</li>
        <li>Système de paiement sécurisé par carte bancaire ou par le biais d'un lien de paiement.</li>
        <li>Formation sur la maîtrise des ventes de voyage à la carte, spécialement pour les professionnels de voyage,</li>
        <li>Partage des témoignages.</li>
        <li>Création et partage de “Nos brochures papiers et numériques interactifs”.</li>
      </ul>
    `,
  },
  {
    number: "3",
    title: "Accessibilité & expérience utilisateur",
    html: `
      <p>Nous nous engageons à déployer tous les moyens raisonnables pour assurer le fonctionnement continu du site web, 7 jours/7 et 24 heures/24.</p>
      <p>En aucun cas, Nuance du monde ne peut être tenu responsable de l'indisponibilité, de l'interruption ou du mauvais fonctionnement du site, quelle qu'en soit la cause, telle qu'une défaillance de son fournisseur d'accès internet, de son hébergeur, d'une intrusion de tiers ou de force majeure.</p>
      <p>Nuance du monde décline toute responsabilité pour les inconvénients ou les dommages découlant de l'utilisation d'Internet, y compris la présence de virus informatiques ou de spywares.</p>
      <p>Nuance du monde ne peut être tenu responsable de tout préjudice matériel ou immatériel, direct ou indirect, qui pourrait résulter de l'utilisation ou de l'impossibilité d'utiliser le site www.nuancedumonde.com.</p>
      <p>Veuillez noter que Nuance du monde se réserve le droit de modifier les fonctionnalités du site ou les caractéristiques de ses services /produits à tout moment, sans préavis.</p>
    `,
  },
  {
    number: "4",
    title: "Droits de propriété intellectuelle",
    html: `
      <p>Le présent Site Web et son contenu sont protégés par les lois sur les droits d’auteur, les marques et d'autres normes juridiques. Nous nous réservons tous les droits qui ne sont pas expressément octroyés par les présentes Conditions d’Utilisation.</p>
    `,
  },
  {
    number: "5",
    title: "Marque commerciale",
    html: `
      <p>«Nuance du monde», les logotypes, les marques de service et les signes distinctifs apparaissant sur le présent site web (collectivement, les « marques de commerce ») sont des marques de commerce déposées de ITTS.</p>
      <p>À l'exception des cas prévus explicitement dans les Conditions d'Utilisation ou sans une autorisation écrite explicite de ITTS Inc, vous n'êtes pas autorisé(e) à utiliser les marques de commerce ou leurs variantes dans une autre langue, seules ou associées à d'autres mots ou éléments de conception.</p>
      <p>Pour toute demande d’autorisation par écrit, veuillez utiliser la fonction Formulaire de contact de ce site web www.nuancedumonde.com.</p>
    `,
  },
  {
    number: "6",
    title: "Droits d'auteur : les restrictions d'utilisation du contenu",
    html: `
      <p>Sauf indication contraire et à condition de respecter toutes vos obligations en vertu des présentes Conditions Générales d’Utilisation, vous êtes autorisé(e) à visionner, à copier, à imprimer, à distribuer et à utiliser (sans le modifier) le contenu du présent site web aux conditions suivantes :</p>
      <ul>
        <li>i) L’utilisation du contenu est uniquement pour des fins personnels et vise un but d’information seulement ;</li>
        <li>ii) Tout extrait du contenu doit être accompagné de l’avis relatif aux droits d’auteur ou autre mention à cet effet, s’il y a lieu, apparaissant sur le site web concernant le contenu.</li>
      </ul>
      <p>Vous n’êtes pas autorisé(e) :</p>
      <ul>
        <li>à copier, à tenter de sonder, d’explorer ou d’évaluer la vulnérabilité du site web ou d’un système ou un réseau connexe,</li>
        <li>ou à violer les mesures de sécurité ou d’authentification utilisées dans le cadre du site web, le cas échéant,</li>
        <li>ou des systèmes et des réseaux connexes, ni à modifier, déplacer, supprimer ou autrement ajouter quelque chose au site web,</li>
        <li>ni tenter de décrypter, de décompiler, de désassembler, de faire de l’ingénierie inverse, ni à utiliser ou restreindre les logiciels, les procédés exclusifs ou les technologies intégrées utilisés pour fournir le site web.</li>
      </ul>
      <p>En accédant et en utilisant ce site web, vous acceptez de vous conformer à toutes les lois applicables. Votre utilisation ne doit pas être dommageable ou porter atteinte aux activités de ITTS ou de tiers.</p>
    `,
  },
  {
    number: "7",
    title: "Protection et utilisation de vos renseignements personnels",
    html: `
      <p>Vous reconnaissez que nous pouvons utiliser vos données et vos renseignements personnels conformément à notre politique de confidentialité.</p>
      <p>En parcourant notre portail en ligne, vous consentez à la collecte, à l'utilisation et à la conservation de vos données personnelles conformément aux dispositions de notre politique de protection de la vie privée. Notre politique de confidentialité est intégrée par référence aux présentes Conditions Générales d'Utilisation.</p>
    `,
  },
  {
    number: "8",
    title: "Les clauses de non-responsabilité et la limitation de responsabilité",
    html: `
      <p>Les clauses de non-responsabilité et de limitations de responsabilité s’appliquent dans la mesure où la loi le permet, qu’il s’agisse d’une obligation contractuelle, juridique ou délictuelle (y compris, sans s’y restreindre, la négligence) ou autrement, relativement à l’utilisation du présent site web.</p>
      <p>Bien que ITTS déploie tous les efforts raisonnables pour assurer l’exactitude des renseignements fournis sur le site web, le présent site web est fourni « tel quel ». Nous ne faisons aucune déclaration, expresse ou implicite, ni n’accordons aucune garantie à l’égard du contenu.</p>
      <p>Sans limiter la portée de ce qui précède, nous ne garantissons pas que le présent site web ne contient aucune erreur, ni aucun virus ou programme malveillant, ni qu’il réponde à des critères précis en matière de rendement ou de qualité, ni qu’il sera accessible ou fonctionnel sans interruption.</p>
      <p>Nous déclinons expressément toute responsabilité relative à toute garantie implicite, y compris, sans s’y restreindre, en ce qui a trait à la qualité marchande, au titre, au caractère approprié, à une fin donnée, à l’absence de violation, à la compatibilité, à la sécurité et à l’exactitude.</p>
      <p>L’utilisation de ce présent site web est sous votre entière responsabilité, et vous acceptez de supporter tous les risques et pertes associés, y compris la perte de service ou de données.</p>
      <p>Nous n'assumons aucune responsabilité à l’égard de dommages-intérêts directs, indirects, spéciaux, accessoires, consécutifs ou punitifs, ni d’aucun autre dommage quel qu’il soit, que ce soit dans une action en justice recherchant sa responsabilité contractuelle, juridique ou délictuelle (y compris, sans s’y restreindre, la négligence) ou autrement, relativement à l’utilisation du présent Site web.</p>
    `,
  },
  {
    number: "9",
    title: "Lois applicables",
    html: `
      <p>Votre utilisation du site web et les Conditions d’Utilisation sont régies par les lois de la province de Québec et les lois du Canada, sans égard aux principes de conflit de lois.</p>
      <p>Vous reconnaissez par les présentes que tout litige ayant traits à votre utilisation du site web ou aux Conditions d’Utilisation sera soumis à la compétence des tribunaux du district de Montréal, province de Québec.</p>
    `,
  },
  {
    number: "10",
    title: "Autres conditions",
    html: `
      <p>Advenant qu’une partie des présentes Conditions d’Utilisation soit invalide ou inexécutable dans un territoire donné :</p>
      <ul>
        <li>i) dans ce territoire, cette clause sera interprétée de façon à donner effet autant que possible à son intention initiale dans la mesure permise par la loi, et les autres clauses des présentes Conditions d’Utilisation demeureront en vigueur ;</li>
        <li>ii) dans les autres territoires, toutes les conditions demeureront pleinement en vigueur.</li>
      </ul>
      <p>Nous pouvons réviser les présentes Conditions d’Utilisation en tout temps à notre seule discrétion en publiant ces Conditions d’Utilisation révisées sous le lien Conditions d’utilisation (c.-à-d. la page Web que vous consultez actuellement) ou ailleurs sur ce site web.</p>
      <p>Ces révisions seront en vigueur en ce qui a trait à vous au moment de leur publication, sauf indication contraire de notre part. Il vous incombe de vous tenir au courant de toute révision apportée aux Conditions d’Utilisation en vérifiant la présente page Web. Votre utilisation continue du présent Site Web suivant les modifications apportées aux Conditions d’Utilisation signifiera que vous acceptez implicitement les Conditions d’Utilisation révisées.</p>
    `,
  },
  {
    number: "11",
    title: "Politique de protection de la vie privée",
    html: `
      <p>Devant le développement des nouveaux outils de communication, il est nécessaire de porter une attention particulière à la protection de la vie privée. C'est pourquoi nous nous engageons à protéger votre droit à la vie privée et les renseignements personnels que nous collectons. Votre utilisation du présent site web confirme que vous acceptez que vos renseignements soient utilisés tels qu’il est décrit dans la présente politique.</p>
      <p>Si vous avez des questions ou des préoccupations à l’égard de cette politique, veuillez communiquer avec le webmestre via la rubrique “Formulaire de contact” ou nous envoyer un courriel à l’adresse <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a>.</p>
    `,
  },
  {
    number: "12",
    title: "Collecte des renseignements",
    html: `
      <p>ITTS peut recueillir par l’entremise des fonctionnalités de ce site web des renseignements personnels fournis volontairement par les visiteurs via les fonctionnalités du Site Web. De tels renseignements peuvent inclure, mais sans s’y limiter, votre nom, votre adresse e-mail, votre code postal, votre numéro de téléphone et votre adresse postale.</p>
      <p>Nous vous invitons à prendre connaissance de notre Politique de Confidentialité pour en savoir plus sur la collecte, le traitement et l'utilisation des données à caractère personnel vous concernant.</p>
    `,
  },
  {
    number: "13",
    title: "Fichiers, journaux, témoins et pixels invisibles",
    html: `
      <p>ITTS recueille sur ce site web les données standards de fichiers journaux Internet, y compris votre adresse IP, le type et la langue de votre navigateur, la fréquence d’accès et les adresses de référence de sites web.</p>
      <p>Afin d’assurer une bonne gestion de notre site web et de faciliter la navigation, nous pouvons utiliser, et permettre à nos fournisseurs de services d’utiliser, des témoins (de petits fichiers de texte stockés dans le navigateur d’un utilisateur) ou des pixels invisibles (des images électroniques qui permettent au site web d’amasser des informations statistiques quant au nombre de visiteurs qui accèdent à une page en particulier et d’accéder à certains témoins) pour recueillir des données agrégées. Nous pouvons avoir recours à la plateforme Google Analytics aux fins du traitement des données agrégées.</p>
      <p>Certains des témoins que nous utilisons sont nécessaires pour vous permettre de naviguer sur le Site Web et d’utiliser les fonctions du Site Web, notamment accéder à des zones sécurisées dont le contenu est destiné aux utilisateurs inscrits.</p>
      <p>Nous nous servons également de témoins liés aux fonctions pour enregistrer les choix que vous avez effectués et pour personnaliser le Site Web pour les utilisateurs. Ces renseignements sont habituellement rendus anonymes et ne sont pas utilisés à d’autres fins.</p>
    `,
  },
  {
    number: "14",
    title: "Sécurité de l’information",
    html: `
      <p>Nous avons mis en place des normes commerciales raisonnables en matière de sécurité de la technologie et des opérations afin de protéger et de conserver au Canada pour la durée de votre relation d’affaires avec nous, tous les renseignements personnels collectés sur le présent site web contre l’accès, la divulgation, la modification ou la destruction non autorisés.</p>
    `,
  },
  {
    number: "15",
    title: "Durée de conservation de vos renseignements personnels",
    html: `
      <p>Nous ne conserverons les renseignements personnels que pour la durée nécessaire aux fins prévues et pour nous conformer à nos obligations légales et réglementaires. Pour en savoir plus sur la durée pendant laquelle nous conservons les renseignements personnels, veuillez vous référer à la rubrique « Formulaire de contact » ou nous envoyer un courriel à <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a>.</p>
    `,
  },
  {
    number: "16",
    title: "Changement à notre politique de protection de la vie privée",
    html: `
      <p>Nous pouvons modifier cette politique de temps à autre à notre discrétion. Si nous apportons des changements à cette politique, nous modifierons la date de révision au haut de la page. Cet énoncé modifié sera en vigueur en ce qui a trait à vous et à vos renseignements à compter de cette date de révision.</p>
      <p>Nous vous recommandons vivement de vous référer régulièrement à cette section du Site web pour savoir comment nous protégeons vos renseignements et les conditions applicables en vigueur.</p>
    `,
  },
  {
    number: "17",
    title: "Protection des renseignements personnels des enfants",
    html: `
      <p>Nous comprenons l’importance de protéger la confidentialité des enfants dans l’univers interactif en ligne. Le présent site web n’est pas conçu pour les enfants et ne leur est pas destiné. Notre politique ne vise pas à recueillir des renseignements personnels de personnes âgées de 18 ans et moins.</p>
    `,
  },
  {
    number: "18",
    title: "Gestion des cookies sur nuancedumonde.com",
    html: `
      <p>Les cookies sont de minuscules fichiers textes ou fragments de code comportant généralement un identifiant unique sous forme de code. Chaque fois que vous accédez à un site web, votre ordinateur ou appareil mobile reçoit une requête pour enregistrer un fichier et pour accéder aux données qui y sont stockées. Les données collectées par le biais des cookies peuvent inclure la date et l'heure de votre visite, ainsi que la manière dont vous interagissez avec un site web.</p>
    `,
  },
  {
    number: "19",
    title: "Nous joindre",
    html: `
      <p>Pour toute demande d'information sur nos CGU ou le fonctionnement de notre plateforme, veuillez nous contacter par courriel à l'adresse <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a> ou par téléphone au 1.438.488.9080.</p>
    `,
  },
];

export default function CGUPage() {
  return (
    <div className="bg-gray-50">
      <header className="site-section bg-linear-to-b from-black via-black/40 to-white pb-0 lg:pb-10">
        <div className="site-container space-y-8">
          <div className="rounded-[36px] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] bg-[#111] text-white">
              <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-16 flex items-end">
                <div className="space-y-5 max-w-xl">
                 
                  <p className="text-sm tracking-[0.35em] uppercase text-gray-200">
                    Votre passeport pour une expérience utilisateur optimale.
                  </p>
                  <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-lg">
                    Découvrez nos règles d&apos;utilisation du site pour une
                    navigation en toute sécurité et en toute confiance
                  </p>
                </div>
              </div>

              <div className="relative min-h-[260px] sm:min-h-[320px]">
                <div className="absolute inset-0 bg-linear-to-bl from-black/35 to-transparent" />
                <img
                  src={HERO_IMAGE}
                  alt="Conditions Générales d'Utilisation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center px-4">
            <div className="inline-flex flex-wrap rounded-[22px] bg-white shadow-[0_15px_45px_rgba(15,15,15,0.15)] overflow-hidden border border-gray-200 w-full sm:w-auto">
              {navLinks.map((link) => {
                const isCurrent = link.href === "/conditions-generales-dutilisation-cgu";
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold transition-colors ${
                      isCurrent
                        ? "bg-white text-gray-900 shadow-[inset_0_-4px_0_rgba(0,0,0,0.08)]"
                        : "bg-[#f7f6f4] text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-12 sm:space-y-16 md:space-y-20 pb-16 sm:pb-20 md:pb-24">
        <section className="site-section">
          <div className="site-container max-w-5xl space-y-8">
            <div className="space-y-5 text-gray-800">
              <h2
                className="text-3xl sm:text-4xl font-semibold"
                style={{ color: ACCENT_COLOR, fontFamily: "Alro" }}
              >
                Conditions générales d&apos;utilisation (CGU)
              </h2>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container max-w-5xl space-y-8">
            <div className="space-y-4">
              {accordionItems.map((item) => (
                <details
                  key={item.number}
                  className="group border border-gray-200 rounded-[28px] bg-gray-100/80 shadow-sm transition-all open:bg-white open:shadow-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-5 sm:px-8 sm:py-6">
                    <div className="flex items-center gap-4">
                      <span className="flex text-xl h-12 w-12 items-center justify-center rounded-full font-semibold text-[#d9a900] ">
                        {item.number}
                      </span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <span
                      className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-semibold text-gray-600 shadow transition group-open:rotate-45"
                      style={{ color: ACCENT_COLOR }}
                    >
                      +
                    </span>
                  </summary>

                  <div className="px-6 pb-6 sm:px-8 space-y-4 text-gray-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_strong]:text-gray-900">
                    <div
                      className="space-y-4"
                      dangerouslySetInnerHTML={{ __html: item.html }}
                    />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container max-w-5xl grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
                Un doute ? Parlons-en
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                Nous restons disponibles
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Notre équipe vous accompagne pour toute question relative aux
                CGU et à l&apos;utilisation du site.
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Courriel :</span>{" "}
                  <a
                    href="mailto:info@nuancedumonde.com"
                    className="text-amber-600 underline"
                  >
                    info@nuancedumonde.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Téléphone :</span>{" "}
                  1.438.488.9080
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Autres documents légaux
              </h3>
              <ul className="space-y-3 text-gray-700">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:underline"
                    >
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/devis-personnalise"
                    className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:underline"
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Demande de devis personnalisée
                  </Link>
                </li>
              </ul>
              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                Les documents sont mis à jour régulièrement. Consultez cette
                page avant toute utilisation ou saisie d&apos;informations
                sensibles.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
