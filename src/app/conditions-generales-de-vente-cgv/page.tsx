import Link from "next/link";
import type { Metadata } from "next";
import { generateMetadata as getMetadata } from "@/lib/metadata";

const HERO_IMAGE =
  "https://blogs.nuancedumonde.com/wp-content/uploads/2024/05/CGV2.jpg";
const ACCENT_COLOR = "#d9a900";


const navLinks = [
  {
    label: "Conditions générales de vente",
    href: "/conditions-generales-de-vente-cgv",
  },
  {
    label: "Conditions générales d’utilisation",
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
    number: "01",
    title: "La politique des prix",
    html: `
      <p>Nos prix incluent, lorsque précisé dans votre offre : les vols internationaux aller-retour au départ de Montréal, les transferts, le transport terrestre, l’hébergement en occupation double, les repas mentionnés, les visites prévues, les guides locaux francophones, la présence éventuelle d’un accompagnateur québécois et la garantie du Fonds d’indemnisation de l’OPC.</p>
      <p>Ils tiennent compte des taxes applicables (TPS, TVQ, taxes de séjour), du coût du carburant et des taux de change au moment de la publication. En cas de divergence entre une brochure et le programme détaillé remis au voyageur, c’est ce dernier qui fait foi.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Les taxes</h4>
      <p>Sauf mention contraire, les taxes de séjour, touristiques et d’hébergement sont comprises. Si des taxes locales doivent être réglées sur place, Nuance du Monde les remboursera sur présentation du reçu lorsqu’aucune mention n’était indiquée sur la réservation.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Les exclusions</h4>
      <p>Les dépenses personnelles, les repas et boissons non mentionnés, les excursions facultatives et les pourboires (guides et chauffeurs) sont exclus du prix. Les pourboires restent laissés à l’appréciation du voyageur, hormis certaines croisières où ils peuvent être obligatoires.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Ajustement de prix</h4>
      <p>Conformément à la loi, un ajustement peut intervenir en cas de surcharge carburant ou d’augmentation de plus de 5 % du taux de change 45 jours avant l’achat. Une hausse &lt; 7 % est payable par le voyageur. ≥ 7 %, vous pouvez accepter l’ajustement ou annuler sans frais (hors taxes) si nous n’offrons pas de service de remplacement. Aucun ajustement <strong>à moins de 30 jours</strong> du départ.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Voyages de groupe</h4>
      <p>Les tarifs sont basés sur un nombre minimum de participants. Si ce seuil n’est pas atteint, un départ alternatif ou un remboursement intégral est proposé, sans indemnité supplémentaire.</p>
    `,
  },
  {
    number: "02",
    title: "Les frais d’annulation et de modification",
    html: `
      <p>Toute annulation doit être transmise par écrit à un conseiller Nuance du Monde. La date d’annulation correspond à la réception de cet écrit. Aucun remboursement n’est possible une fois le voyage commencé.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Forfaits avec vols internationaux</h4>
      <ul>
        <li>Jusqu’à 90 jours avant départ : 40 % du montant total.</li>
        <li>89 à 30 jours : 60 % du montant total.</li>
        <li>29 à 15 jours : 90 % du montant total.</li>
        <li>14 jours et moins : 100 % du montant total.</li>
      </ul>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Forfaits sans vols internationaux</h4>
      <ul>
        <li>Jusqu’à 60 jours avant départ : 30 % du montant total.</li>
        <li>59 à 5 jours : 70 % du montant total.</li>
        <li>4 jours et moins : 100 % du montant total.</li>
      </ul>
      <p>Les frais s’appliquent également en cas de guerre, pandémie, catastrophe naturelle ou tout événement similaire, même limitrophe à la destination, sauf interdiction officielle de voyager.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Frais de modification</h4>
      <p>Des frais administratifs s’appliquent pour toute modification autorisée à plus de 90 jours du départ. À moins de 90 jours, aucun changement n’est possible sans l’accord des fournisseurs et d’éventuels coûts additionnels.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Corrections de nom</h4>
      <p>Les noms doivent correspondre exactement aux passeports. Une correction est considérée comme une annulation suivie d’une nouvelle réservation et entraîne les frais correspondants.</p>
    `,
  },
  {
    number: "03",
    title: "Le paiement",
    html: `
      <p>Une réservation est confirmée uniquement après réception du paiement requis. Le solde est exigible au plus tard 90 jours avant le départ, sauf mention contractuelle différente. À défaut de paiement à l’échéance, la réservation est considérée comme annulée par le client et les frais d’annulation s’appliquent.</p>
      <p>Les plans de versements mensuels sont précisés dans l’offre ou le contrat. Les conditions d’annulation demeurent identiques.</p>
      <h4 class="text-[${ACCENT_COLOR}] font-semibold mt-6 mb-3 uppercase">Paiement par carte de crédit</h4>
      <p>Le titulaire de la carte doit être l’un des voyageurs inscrits. En communiquant ses informations, il confirme accepter les conditions pour tous les passagers du dossier. Nuance du Monde se réserve le droit de vérifier l’authenticité des informations fournies.</p>
    `,
  },
  {
    number: "04",
    title: "La description des forfaits",
    html: `
      <p>Nous mettons tout en œuvre pour assurer l’exactitude des informations décrites dans nos documents. Néanmoins, certains services peuvent être modifiés par les fournisseurs sans préavis. L’ordre des visites, les horaires et même la catégorie de certains services peuvent varier selon les réalités locales (météo, affluence, obligations réglementaires, etc.).</p>
      <p>Les photos, plans et listes d’hôtels sont fournis à titre indicatif. Tout changement est réalisé pour un service de qualité équivalente ou supérieure.</p>
    `,
  },
  {
    number: "05",
    title: "La modification ou l’annulation par Nuance du Monde",
    html: `
      <p>Nous pouvons, à tout moment, annuler ou remplacer un service touristique par un autre équivalent. En cas d’annulation initiée par Nuance du Monde (hors force majeure), notre responsabilité est limitée au remboursement des montants payés pour le service annulé.</p>
      <p>En situation de force majeure (guerre, pandémie, catastrophe naturelle, décision gouvernementale, etc.), aucun dédommagement additionnel n’est dû. Nous collaborerons toutefois de bonne foi afin de proposer une solution comparable.</p>
    `,
  },
  {
    number: "06",
    title:
      "La modification d’itinéraire de croisière, de transport aérien ou terrestre",
    html: `
      <p>Les transporteurs peuvent modifier ou annuler des escales, ajuster les horaires ou changer de type d’appareil. Les capitaines peuvent adapter un itinéraire en fonction des conditions de navigation ou du niveau d’eau. Ces décisions, indépendantes de notre volonté, ne donnent droit à aucun remboursement.</p>
      <p>En cas de modification majeure, les voyageurs doivent adresser leurs recours directement au transporteur concerné.</p>
    `,
  },
  {
    number: "07",
    title: "Le service non utilisé",
    html: `
      <p>Aucun remboursement n’est accordé pour les prestations non utilisées par le voyageur. En cas de défaillance d’un fournisseur ou d’un tiers, le voyageur doit entreprendre les recours directement auprès de celui-ci.</p>
    `,
  },
  {
    number: "08",
    title: "L’hébergement",
    html: `
      <p>La classification des établissements dépend des normes locales et peut différer des standards nord-américains. Les chambres sont généralement disponibles à partir de 16 h et doivent être libérées avant 11 h. La configuration (vue, superficie, mobilier) peut varier au sein d’un même établissement.</p>
      <p>Les chambres triples ou quadruples sont limitées et souvent composées de deux lits doubles. Les chambres individuelles nécessitent un supplément et peuvent être plus petites. Toute modification du nombre d’occupants peut entraîner des suppléments ou un refus d’hébergement.</p>
    `,
  },
  {
    number: "09",
    title: "Les mineurs",
    html: `
      <p>La tarification enfant s’applique généralement de 5 à 12 ans lorsque l’enfant partage la chambre de deux adultes sans lit supplémentaire. Les moins de 5 ans ne sont pas recommandés sur nos circuits accompagnés. Les mineurs doivent être accompagnés d’un adulte et satisfaire aux exigences spécifiques des établissements (âge minimal, documents requis, etc.).</p>
    `,
  },
  {
    number: "10",
    title: "La grossesse",
    html: `
      <p>Toute grossesse doit être signalée lors de la réservation. Les lignes aériennes acceptent habituellement les passagères jusqu’à 36 semaines, et les croisiéristes limitent souvent l’accès dès 24 semaines. Un certificat médical peut être exigé. Les politiques variant selon les compagnies, elles seront confirmées lors de la réservation.</p>
    `,
  },
  {
    number: "11",
    title: "Les transports",
    html: `
      <p>Nos programmes dépendent des règlements propres aux transporteurs. Les compagnies aériennes mentionnées le sont à titre indicatif et peuvent être remplacées. Les horaires peuvent être modifiés avant le départ ou pendant le voyage.</p>
      <p>La durée indiquée correspond au nombre de nuitées, transport inclus. En cas de retard ou d’extension due au transport aérien, nous assistons les voyageurs pour que le transporteur assume les frais d’hébergement ou de restauration.</p>
      <p>Les bagages autorisés dépendent des transporteurs. Nuance du Monde n’est pas responsable des pertes ou dommages, et recommande vivement une assurance bagage. Les voyageurs doivent identifier leurs bagages et se conformer aux règles locales (rotation des sièges, interdiction de fumer, etc.).</p>
    `,
  },
  {
    number: "12",
    title: "La responsabilité du voyageur",
    html: `
      <p>Nuance du Monde ou ses fournisseurs peuvent expulser tout voyageur adoptant un comportement préjudiciable, menaçant ou non conforme aux règlements. Aucun remboursement ne sera accordé et toutes les dépenses occasionnées resteront à la charge du voyageur.</p>
      <p>Le prestataire peut refuser le service à un voyageur en retard, sans documents, présentant un danger pour lui-même ou autrui, transportant des objets interdits ou n’ayant pas réglé l’intégralité des frais. Les voyageurs doivent également s’assurer qu’ils sont aptes physiquement et psychologiquement à participer aux activités prévues.</p>
      <p>Il leur revient de vérifier les horaires des transports 24 h avant départ, d’arriver à l’aéroport au moins 3 h avant le vol et de s’enregistrer en ligne lorsque cela est possible.</p>
    `,
  },
  {
    number: "13",
    title: "L’assurance voyage",
    html: `
      <p>Nous recommandons fortement de souscrire une assurance voyage complète couvrant santé, annulation, bagages et responsabilité. Si vous bénéficiez d’une couverture via une carte de crédit ou un autre assureur, vérifiez attentivement les plafonds, exclusions et durée de couverture et complétez au besoin.</p>
    `,
  },
  {
    number: "14",
    title: "L’exclusion de responsabilité",
    html: `
      <p>Nuance du Monde agit en tant qu’agent auprès des fournisseurs. Nous n’avons aucun contrôle sur leurs opérations et ne pouvons être tenus responsables de leurs omissions, actes ou défaillances. Notre responsabilité se limite aux obligations de moyens pour que les services achetés soient disponibles.</p>
      <p>Aucun dédommagement ne peut être exigé en cas d’acte d’un tiers, de maladie, de perte de documents, de force majeure, de refus d’embarquement, de modification imposée par un fournisseur ou par une autorité gouvernementale.</p>
    `,
  },
  {
    number: "15",
    title: "Le règlement des plaintes",
    html: `
      <p>Toute difficulté doit être signalée immédiatement à notre conciergerie ou à l’accompagnateur afin que nous puissions intervenir sur place. Passé ce délai, les plaintes seront considérées uniquement si aucune solution n’a pu être apportée.</p>
      <p>Une plainte écrite détaillée doit être transmise à info@nuancedumonde.com dans les 14 jours suivant la fin des services. Si votre voyage a été acheté chez un partenaire, adressez-vous à votre agence.</p>
      <p>Les services payés mais non reçus peuvent, dans certains cas, être indemnisés par le Fonds d’indemnisation des clients des agents de voyages (FICAV) administré par l’OPC.</p>
    `,
  },
  {
    number: "16",
    title: "Le changement",
    html: `
      <p>Nuance du Monde ou ses fournisseurs peuvent autoriser certaines modifications pour accommoder un voyageur. Les demandes doivent être adressées par écrit à Nuance du Monde. Les changements non autorisés restent à la charge du voyageur et ne sont pas remboursables. Si aucune modification n’est possible, les frais d’annulation s’appliquent.</p>
    `,
  },
  {
    number: "17",
    title: "Les activités non incluses",
    html: `
      <p>Nous ne pouvons être tenus responsables de la qualité ou de la sécurité d’activités achetées sur place et non incluses dans votre forfait (excursions optionnelles, activités libres, etc.). Tout contrat pour ces services est conclu directement avec le fournisseur local et relève de sa responsabilité.</p>
    `,
  },
  {
    number: "18",
    title: "Les documents de voyage",
    html: `
      <p>Il est de votre seule responsabilité de disposer de passeports, visas, autorisations, carnets de vaccination et autres documents requis, et ce, aux frais du voyageur. Un refus d’entrée ou d’embarquement lié à une documentation non conforme ne peut engager la responsabilité de Nuance du Monde.</p>
      <p>Les documents de voyage (horaires, itinéraire détaillé, liste des hébergements) sont transmis environ 10 jours avant le départ, sous réserve du paiement intégral.</p>
    `,
  },
  {
    number: "19",
    title: "Avis aux clients",
    html: `
      <p>Le voyageur reconnaît que certains imprévus font partie intégrante d’un voyage international : niveaux de vie différents, coutumes locales, événements spéciaux, interruptions de services, fêtes nationales, etc. Ces réalités peuvent affecter les circuits sans compensation possible.</p>
      <p>Chaque voyageur doit s’assurer d’être en bonne santé et autonome pour entreprendre le voyage choisi.</p>
    `,
  },
  {
    number: "20",
    title: "Les commentaires, les questions et les réclamations",
    html: `
      <p>Tous les incidents (blessure, insatisfaction, annulation de service) doivent être signalés immédiatement au contact d’urgence afin de vous assister. Nous exigeons un comportement respectueux envers notre personnel et nos partenaires. En cas de comportement abusif, nous nous réservons le droit de cesser la prestation.</p>
      <p>Pour tout commentaire ou inquiétude concernant un hébergement ou un service, écrivez-nous à <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a> ou téléphonez au 1 438 488 9080.</p>
    `,
  },
  {
    number: "21",
    title: "Le droit à l’image",
    html: `
      <p>En participant à un voyage Nuance du Monde, vous consentez à l’utilisation éventuelle de vos images (photos, vidéos) par nos équipes à des fins promotionnelles (supports imprimés ou numériques). Vous pouvez refuser ce droit en l’indiquant formellement à notre représentant.</p>
    `,
  },
  {
    number: "22",
    title: "Les lois applicables",
    html: `
      <p>Les présentes conditions sont régies par les lois de la province de Québec.</p>
    `,
  },
  {
    number: "23",
    title: "La propriété intellectuelle",
    html: `
      <p>Toutes les images, photos, vidéos et supports de communication sont la propriété de Nuance du Monde ou de leurs ayants droit. Toute reproduction ou réutilisation nécessite une autorisation écrite préalable et doit mentionner l’auteur ainsi que la source.</p>
    `,
  },
  {
    number: "24",
    title: "La confidentialité",
    html: `
      <p>Nuance du Monde conserve de manière sécurisée les coordonnées et renseignements liés aux prestations vendues. Ces informations sont utilisées uniquement pour la gestion du dossier et l’amélioration de nos services. Nous pouvons communiquer avec vous pour assurer un suivi de votre voyage.</p>
    `,
  },
  {
    number: "25",
    title: "Bureau et contact assurances",
    html: `
      <p>Chantal Lessard<br />ESSOR Insurance<br />Courriel : chantal.lessard@essor.ca<br />1100 University St, 6ᵉ étage<br />Montréal (Québec) H3B 3A5, Canada</p>
    `,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("page", "conditions-generales-de-vente-cgv");
}

export default function ConditionsGeneralesVentePage() {
  return (
    <div className="bg-gray-50">
      <header className="site-section bg-linear-to-b from-black via-black/40 to-white pb-0 lg:pb-10">
        <div className="site-container space-y-8">
         <div className="rounded-[36px] overflow-hidden shadow-2xl">
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] bg-[#111] text-white">
    <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-16 flex items-end">
      <div className="space-y-5 max-w-xl">
        <p className="text-sm tracking-[0.35em] uppercase text-gray-200">
          Transparence et confiance
        </p>
        <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-lg">
          Découvrez nos conditions générales de vente, notre engagement envers
          vous.
        </p>
      </div>
    </div>

    <div className="relative min-h-[260px] sm:min-h-[320px]">
      <div className="absolute inset-0 bg-linear-to-bl from-black/35 to-transparent" />
      <img
        src={HERO_IMAGE}
        alt="Documents contractuels Nuance du Monde"
        className="h-full w-full object-cover"
      />
    </div>
  </div>
</div>

          <div className="flex justify-center px-4">
            <div className="inline-flex flex-wrap rounded-[22px] bg-white shadow-[0_15px_45px_rgba(15,15,15,0.15)] overflow-hidden border border-gray-200 w-full sm:w-auto">
              {navLinks.map((link) => {
                const isCurrent =
                  link.href === "/conditions-generales-de-vente-cgv";
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
            <div className="space-y-4 text-gray-800">
              <h2
                className="text-3xl sm:text-4xl font-semibold"
                style={{
                  color: ACCENT_COLOR,
                  fontFamily: "Alro",
                }}
              >
                Conditions générales de vente (CGV)
              </h2>
              <p className="text-sm font-semibold tracking-[0.3em] text-gray-700">
                NOS CONDITIONS GÉNÉRALES ET PARTICULIÈRES DE VENTE
              </p>
              <p>
                Avant toute réservation, veuillez prendre connaissance de nos
                conditions générales de vente ci-dessous.
              </p>
              <p>
                Nuance du Monde est une marque commerciale d&apos;INTELLIGENCE
                TECHNOLOGIQUE ET TOURISME SOLUTIONS INC. (ITTS). Agence de
                voyage détentrice du numéro de permis : 703510, ayant pour siège
                social au 1087 Laurier ouest, Outremont, QC H2V2L2, Montréal,
                Canada.
              </p>
              <p>
                Toute inscription à l’un des voyages offerts par Nuance du Monde
                équivaut à l’acceptation de toutes les conditions énoncées
                ci-après, lesquelles font partie intégrante des obligations
                contractuelles de Nuance du Monde ainsi que du voyageur, et
                gouvernent leurs obligations respectives.
              </p>
              <p>
                Les présentes conditions générales s&apos;étendent à
                l&apos;ensemble des services mentionnés sur notre site web,
                qu&apos;ils soient proposés à la carte, sous forme de forfaits,
                de circuits, de combinés entre pays ou de croisières, incluant
                toutes les rubriques.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Coordonnées
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  INTELLIGENCE TECHNOLOGIQUE ET TOURISME SOLUTIONS INC.
                  <br />
                  1087 Laurier Ouest, Outremont, QC H2V2L2
                  <br />
                  Montréal, Canada
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Conciergerie
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  info@nuancedumonde.com
                  <br />
                  1-844-362-0555 (numéro gratuit)
                  <br />
                  Assistance quotidienne pour toute question ou modification.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container max-w-5xl space-y-8">
            <div className="space-y-4">
              {accordionItems.map((item) => (
                <details
                  key={item.title}
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
                  <div className="px-6 pb-6 sm:px-8 space-y-4 text-gray-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:text-gray-900">
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
                Besoin d’un renseignement ?
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                Notre équipe répond à vos questions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Toute demande écrite reçoit un suivi personnalisé. Pour les
                situations urgentes, privilégiez le téléphone ou le contact
                conciergerie transmis dans vos documents.
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
                  1-844-362-0555
                </p>
                <p>
                  <span className="font-semibold">Conciergerie :</span>{" "}
                  disponible 7 j/7 selon votre destination.
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
                Les documents sont mis à jour régulièrement. Pensez à consulter
                cette page avant la finalisation de votre dossier.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
