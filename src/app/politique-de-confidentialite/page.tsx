import Link from "next/link";
import type { Metadata } from "next";
import { generateMetadata as getMetadata } from "@/lib/metadata";

const HERO_IMAGE =
  "https://blogs.nuancedumonde.com/wp-content/uploads/2024/05/CGV2.jpg";
const ACCENT_COLOR = "#d9a900";

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
    title: "Le propriétaire et le responsable du traitement :-",
    html: `
      <p>Nuance du Monde</p>
      <p>1087 Laurier Ouest</p>
      <p>QC, H2V2L2, Montréal, Canada.</p>
      <p>Courriel de contact du propriétaire : <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a>.</p>
    `,
  },
  {
    number: "2",
    title: "Les cookies et les technologies de collecte automatique de données-",
    html: `
      <p>Pour une meilleure expérience utilisateur, ITTS recourt à des cookies afin de suivre le nombre de visites sur notre site web et de personnaliser nos campagnes publicitaires et nos offres promotionnelles en fonction de vos préférences.</p>
      <p>Ces fichiers, appelés cookies, sont stockés sur votre ordinateur après votre visite sur notre site web. Ils enregistrent des informations vous concernant, telles que la langue d'affichage ou certaines habitudes de navigation. Ces données sont utilisées, entre autres, pour activer certaines fonctionnalités, pour faciliter votre navigation et pour vous proposer des publicités basées sur vos centres d'intérêt.</p>
      <p>Les informations collectées demeurent confidentielles en tout temps. Si, toutefois, vous souhaitez désactiver ou bloquer les cookies, vous avez la possibilité de le faire en ajustant les paramètres de votre ordinateur.</p>
    `,
  },
  {
    number: "3",
    title: "Les données personnelles-",
    html: `
      <p>ITTS ne collecte, n'utilise et/ou ne divulgue vos renseignements personnels qu'avec votre consentement. Dans certaines circonstances, la collecte d'informations personnelles telles que votre nom ou votre adresse e-mail peut être requise, par exemple, lors d'une transaction de voyage ou de l'abonnement à notre infolettre.</p>
    `,
  },
  {
    number: "4",
    title: "La sécurité des données-",
    html: `
      <p>Soyez rassuré, vos renseignements personnels sont traités de manière confidentielle et sont protégés par des mesures de sécurité qui sont en conformité avec les normes de l'industrie. Aucune information personnelle vous concernant n'est divulguée à des tiers, (des partenaires, des annonceurs et des fournisseurs), sans votre accord préalable et explicite.</p>
      <p>Nous limitons l'utilisation et l'accès à vos renseignements personnels aux employés et aux sous-traitants qui en ont besoin pour fournir des services à nos partenaires commerciaux. Nous avons mis en place des mesures de sécurité de nature physique, électronique et procédurale pour garantir la confidentialité de vos données personnelles.</p>
      <p>La sûreté et la sécurité de vos informations dépendent également de vous. Pour toute question ou toute préoccupation relative à la confidentialité de vos données personnelles, veuillez soumettre directement votre demande par courriel à <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a>.</p>
    `,
  },
  {
    number: "5",
    title: "Quelles sont les données personnelles que nous collectons ?-",
    html: `
      <p>Nous sommes en mesure de collecter et de traiter les catégories d'informations personnelles suivantes :</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Identification :</h4>
      <p>Votre nom, date de naissance, sexe, nationalité et numéro de passeport. Si vos enfants mineurs sont inclus dans la réservation, nous recueillerons leurs informations d’identification également.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Coordonnées :</h4>
      <p>Votre numéro de téléphone, adresse physique et adresse électronique. Si vous faites votre réservation par l’entremise d’une agence de voyages, cette agence peut choisir de ne pas partager vos coordonnées avec nous.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Cartes de crédit :</h4>
      <p>Afin d'assurer la confidentialité des informations personnelles en notre possession et de les protéger contre la perte ou le vol, nous avons combiné des moyens matériels, organisationnels et technologiques pour prévenir : tout accès, toute transmission, toute reproduction, toute utilisation ou toute modification non autorisée de ces dernières.</p>
      <p>Nous utilisons le standard de chiffrement SSL (Secure Sockets Layer) pour la transmission d'informations personnelles sur nos sites Web. Ce protocole est utilisé lorsque vous remplissez un formulaire en ligne ou accédez à un lien de paiement.</p>
      <p>Vous pouvez vérifier que cette protection est en place en recherchant le symbole du cadenas sur de nombreux navigateurs Web. SSL permet une connexion sécurisée entre votre navigateur web et notre serveur internet en utilisant une clé privée (ou secrète) pour chiffrer les informations.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Les détails de la réservation :</h4>
      <p>Pendant le processus de réservation, nous recueillons des informations qui peuvent inclure votre date de voyage, vos réservations de vol et d'hôtel, les détails de votre paiement ainsi que les services auxiliaires réservés, le surclassement et les bagages supplémentaires.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Les détails du voyage :</h4>
      <p>Lorsque vous voyagez avec nous, nous recueillons et traitons les informations relatives à votre voyage, telles que : votre itinéraire de voyage, vos informations d'enregistrement, votre carte d'embarquement électronique, vos besoins médicaux, vos exigences alimentaires particulières et toute aide ou préférence supplémentaire requise.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Les interactions :</h4>
      <p>Nous enregistrons et conservons les interactions issues de vos échanges par courriel, en ligne ou via les réseaux sociaux, ainsi que les pièces jointes telles que vos photos et vidéos.</p>
      <p>Lorsque vous nous contactez par téléphone, par exemple en communiquant avec notre département des réservations et/ou notre service à la clientèle, nous pouvons enregistrer vos appels téléphoniques à des fins d’information ou pour prévenir la fraude. Nous recueillons également vos questions ou plaintes.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Les réservations précédentes :</h4>
      <p>Nous recueillons des informations sur les services que nous vous avons fournis dans le passé, y compris vos précédents préparatifs de voyage (vols et autres réservations), les bagages perdus et les commentaires sur nos services et autres interactions avec nous.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">L’utilisation de notre site :</h4>
      <p>En naviguant sur notre site web ou en vous abonnant à notre infolettre, nous sommes en mesure de collecter des informations telles que : votre adresse IP, le type de navigateur, le système d'exploitation, le site web de référence, la langue de correspondance préférée, le comportement de navigation et l'identifiant unique universel («UUID»). Nous pouvons également recevoir des informations relatives à votre localisation.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Les médias sociaux :</h4>
      <p>Les commentaires que vous partagez sur nos plateformes de médias sociaux sont collectés par nous. Selon les configurations de votre réseau social, nous pouvons être amenés à recevoir des informations émanant de votre fournisseur de réseau social.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Les informations personnelles sensibles :</h4>
      <p>Lorsque nous vous fournissons nos services, nous pouvons recueillir des informations personnelles jugées sensibles, car elles pourraient révéler votre origine raciale ou ethnique, votre santé physique ou mentale, vos croyances religieuses ou vos condamnations pénales ou infractions.</p>
      <p>Si vous demandez une assistance médicale spécifique pendant un vol (telle que demander un fauteuil roulant ou de l'oxygène), cela peut révéler des informations sur votre état de santé.</p>
      <p>De plus, vous pouvez divulguer vos croyances religieuses lorsque vous demandez des repas spéciaux ou quand vous nous informez d'autres exigences alimentaires. Pareillement, les détails de votre document de voyage peuvent contenir des informations susceptibles de révéler votre origine raciale ou ethnique.</p>
      <p>Lorsque vous fournissez des informations personnelles sensibles, vous devez explicitement consentir à leur traitement.</p>
      <p>Ces informations personnelles sensibles ne seront collectées et utilisées qu’afin de donner suite à vos demandes spéciales et d’exécuter pleinement nos obligations.</p>
    `,
  },
  {
    number: "6",
    title: "Comment nous recueillons les données vous concernant ?-",
    html: `
      <p>Nous utilisons différentes méthodes pour collecter des données vous concernant, notamment par le biais de :</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Interactions directes :</h4>
      <p>Vous pouvez nous fournir des informations vous concernant en remplissant des formulaires ou en correspondant avec nous par courriel ou par téléphone.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Technologies ou interactions automatisées :</h4>
      <p>Lorsque vous interagissez avec notre site web, nous pouvons collecter automatiquement des données techniques sur votre équipement, vos actions et vos habitudes de navigation, comme indiqué ci-dessus.</p>
      <p>Nous recueillons ces informations en utilisant des cookies et d'autres technologies similaires (voir Cookies et technologies de collecte automatique de données).</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Tiers ou sources accessibles au public :</h4>
      <p>Nous pouvons recevoir des informations vous concernant de la part de tiers, y compris, par exemple, de partenaires commerciaux, de sous-traitants, de réseaux publicitaires, de fournisseurs d'analyses, de fournisseurs d'informations de recherche, de courtiers en données ou d'agrégateurs.</p>

      <h4 class="font-semibold mt-4" style="color:${ACCENT_COLOR}">Contributions des utilisateurs :</h4>
      <p>Vous pouvez également nous fournir des informations à publier ou à afficher ("poster") sur les zones publiques du site web ou à transmettre à d'autres utilisateurs du site web ou à des tiers (collectivement, "contributions de l'utilisateur").</p>
      <p>Vous soumettez les contributions de l'utilisateur pour affichage et transmission à d'autres personnes à vos propres risques.</p>
      <p>En outre, nous ne pouvons pas contrôler les actions des utilisateurs du site web avec lesquels vous choisissez de partager vos contributions d'utilisateur.</p>
      <p>Par conséquent, nous ne pouvons pas garantir et ne garantissons pas que des personnes non autorisées ne verront pas vos contributions d'utilisateur.</p>
    `,
  },
  {
    number: "7",
    title: "Consentement au transfert de données personnelles-",
    html: `
      <p>Notre société est basée au Canada et nous sommes en mesure de traiter, de conserver et de transférer les données personnelles que nous collectons vers des pays étrangers, dont les lois sur la confidentialité peuvent être plus ou moins complètes que celles de votre pays.</p>
      <p>En soumettant vos données personnelles ou en utilisant le site web, vous consentez à ce transfert, à ce stockage ou à ce traitement.</p>
    `,
  },
  {
    number: "8",
    title: "Demandes des consommateurs-",
    html: `
      <p>Les lois sur la confidentialité des données, telles que le projet de loi 64 au Québec et la California Consumer Privacy Act (CCPA), confèrent à certains consommateurs des droits spécifiques concernant leurs informations personnelles.</p>
      <p>Lorsqu'une demande vérifiée est soumise par courriel à <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a>, les consommateurs ont le droit de connaître les catégories et les éléments spécifiques des informations personnelles que nous recevons concernant le consommateur demandeur.</p>
      <p>Nous respecterons les droits légaux prévus par les lois applicables sur la confidentialité des données pour toutes les demandes vérifiées des consommateurs.</p>
      <p>Cette section décrit comment exercer votre droit de :</p>
      <ul>
        <li>Connaître les renseignements personnels que Nuance du Monde a recueillis à votre sujet ;</li>
        <li>Demander que vos renseignements personnels soient supprimés, à condition qu'il n'existe aucune exception.</li>
      </ul>
    `,
  },
  {
    number: "9",
    title: "Suppression de données personnelles-",
    html: `
      <p>Nous sommes tenus de respecter votre droit à la suppression de toutes les données personnelles que nous avons collectées auprès de vous, sous réserve de certaines exceptions :</p>
      <ul>
        <li>La demande violerait le privilège de la preuve ;</li>
        <li>Vos informations sont nécessaires pour se conformer à une ordonnance d'un tribunal, à une loi ou à une procédure judiciaire, y compris pour répondre à une demande d'un gouvernement ou d'un organisme de réglementation ;</li>
        <li>Vos informations sont nécessaires pour achever la transaction pour laquelle les informations personnelles ont été recueillies ;</li>
        <li>Vous avez déjà fait deux demandes dans une période de douze mois.</li>
      </ul>
      <p>Après avoir vérifié et confirmé votre demande de consommateur, si aucune exception ne s'applique, nous effacerons (et demanderons à nos fournisseurs de services d'effacer également) vos données personnelles de nos archives.</p>
    `,
  },
  {
    number: "10",
    title: "Application des droits d'accès, de portabilité et de suppression des données-",
    html: `
      <p>Afin de faire valoir les droits énumérés précédemment, veuillez soumettre une demande vérifiable du consommateur au gestionnaire des données de Nuance du Monde par l'une des méthodes suivantes :</p>
      <ul>
        <li>Téléphone : 1.438.488.9080</li>
        <li>Courriel : <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a></li>
      </ul>

      <p>Vous seul, ou une personne que vous autorisez à agir en votre nom, pouvez faire une demande vérifiable de la part d'un consommateur concernant vos renseignements personnels.</p>

      <p>Si un agent soumet une demande en votre nom, Nuance du Monde exigera que vous :</p>
      <ul>
        <li>Fournissez à l'agent autorisé la permission écrite de le faire ;</li>
        <li>Vérifiez votre propre identité directement auprès de Nuance du Monde.</li>
      </ul>

      <p>Nous pouvons refuser une demande d'un agent qui ne soumet pas la preuve qu'il a été autorisée par vous à agir en son nom. Si l'agent démontre qu'il a été autorisé par une procuration, Nuance du Monde n'exige pas de permission écrite pour faire une demande en votre nom.</p>

      <p>Une demande vérifiable d'accès, de portabilité ou de suppression des données ne peut être faite que deux fois par période de 12 mois. La demande vérifiable du Consommateur doit :</p>
      <ul>
        <li>Fournir des informations suffisantes qui nous permettent, ainsi qu'à nos partenaires commerciaux, de vérifier raisonnablement que vous êtes la personne au sujet de laquelle nous avons recueilli des informations personnelles ou un représentant autorisé.</li>
        <li>Décrire votre demande avec suffisamment de détails pour nous permettre de la comprendre, de l'évaluer et d'y répondre correctement.</li>
      </ul>

      <p>Nuance du Monde ne peut pas répondre à votre demande ou vous fournir des renseignements personnels si nous ne pouvons pas vérifier votre identité ou votre autorité pour faire la demande et confirmer que les renseignements personnels vous concernant.</p>
      <p>Nuance du Monde n'utilisera les renseignements personnels fournis dans le cadre d'une demande vérifiable d'un consommateur que pour vérifier l'identité du demandeur ou son autorisation à faire la demande.</p>
    `,
  },
  {
    number: "11",
    title: "Accès et correction de vos données personnelles-",
    html: `
      <p>Vous pouvez accéder à vos données personnelles, les consulter et les modifier en nous envoyant un courriel à l'adresse <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a> pour demander l'accès aux données personnelles que vous nous avez fournies, les corriger ou les supprimer.</p>
      <p>Il se peut que nous ne soyons pas en mesure de satisfaire une demande de modification ou de suppression d'informations si nous pensons que la modification ou la suppression violerait une loi ou une exigence légale ou aurait un effet négatif sur l'exactitude des informations.</p>
    `,
  },
  {
    number: "12",
    title: "La vie privée des enfants en ligne-",
    html: `
      <p>Le présent site web n'est pas conçu pour les mineurs et nous ne collectons pas sciemment des données personnelles auprès d'enfants âgés de moins de 18 ans ou conformément à la définition légale locale.</p>
      <p>Dans le cas où nous prendrions connaissance du fait que nous avons collecté des données personnelles relatives à un enfant sans son accord préalable, nous les supprimerons sans délai.</p>
      <p>Si vous estimez que nous avons inopinément ou accidentellement recueilli des données relatives à un enfant ou le concernant, n'hésitez pas à nous écrire à l'adresse <a href="mailto:info@nuancedumonde.com">info@nuancedumonde.com</a>.</p>
    `,
  },
  {
    number: "13",
    title: "Mise à jour de notre politique de confidentialité-",
    html: `
      <p>Nuance du Monde se réserve le droit de modifier cet avis de confidentialité à notre discrétion et à tout moment. Lorsque nous apportons des modifications à cet avis de confidentialité, nous publions l'avis mis à jour sur le site web et mettons à jour la date d'entrée en vigueur de l'avis. Votre utilisation de notre site web après l'affichage des modifications constitue votre acceptation de ces modifications.</p>
    `,
  },
  {
    number: "14",
    title: "Informations légales-",
    html: `
      <p>La présente politique de confidentialité ci-dessous a été élaborée en conformité avec plusieurs réglementations.</p>
      <p>Cette politique de confidentialité concerne uniquement ce site web, sauf indication contraire dans le présent document.</p>

      <p>Nuance du Monde</p>
      <p>1087 Laurier Ouest</p>
      <p>QC, H2V2L2, Montréal, Canada.</p>

      <p><strong>La mention légale :</strong></p>
      <p><strong>INTELLIGENCE TECHNOLOGIQUE ET TOURISME SOLUTIONS INC. (ITTS)</strong> 1087</p>
      <p>Laurier Ouest, Outremont, H2V2L2, Montréal, Canada. Numéro de permis: 703510.</p>
    `,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("page", "politique-de-confidentialite");
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-gray-50">
      <header className="site-section bg-linear-to-b from-black via-black/40 to-white pb-0 lg:pb-10">
        <div className="site-container space-y-8">
          <div className="rounded-[36px] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] bg-[#111] text-white">
              <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-16 flex items-end">
                <div className="space-y-5 max-w-xl">
                 
                  <p className="text-sm tracking-[0.35em] uppercase text-gray-200">
                    Termes et conditions
                  </p>
                  <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-lg">
                    Parce que l&apos;utilisation du site web nuancedumonde.com
                    implique l&apos;acceptation de nos conditions, nous vous
                    invitons à consulter attentivement notre politique de
                    confidentialité avant de naviguer.
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
                const isCurrent = link.href === "/politique-de-confidentialite";
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
                style={{
                  color: ACCENT_COLOR,
                  fontFamily: "Alro",
                }}
              >
                La politique de confidentialité
              </h2>

              <p>
                Pour toute demande de renseignement concernant les données
                personnelles, les objectifs et les parties avec qui elles sont
                échangées, veuillez prendre contact avec le propriétaire.
              </p>

              <p>Dernière modification : 16/08/2024</p>

              <p>
                Nuance du Monde, une marque de ITTS Inc. (ci-après dénommée «
                notre Société »), tient à respecter votre droit à la vie privée.
              </p>

              <p>La présente politique de confidentialité vous informe sur :</p>

              <p>
                La manière dont sont traitées les données personnelles
                collectées sur le site Internet www.nuancedumonde.com (ci-après
                dénommé « le Site »),
              </p>

              <p>
                Dans le cadre des services proposés par notre société, tels que
                la souscription à nos offres de voyage, la souscription à des
                services personnalisés ou l’inscription à notre infolettre.
              </p>

              <p>
                <strong>Important :</strong> nous nous réservons le droit de
                modifier cette politique de confidentialité de temps à autre
                pour refléter les changements dans nos pratiques, pour préciser
                davantage nos pratiques ou pour assurer le respect de la
                réglementation. Nous vous invitons à consulter régulièrement la
                présente politique de confidentialité.
              </p>
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
                Notre équipe de conseillers vous accompagne dans l&apos;exercice
                de vos droits et vous informe sur les mesures mises en place
                pour sécuriser vos dossiers.
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
                Les documents sont mis à jour régulièrement. Consultez cette
                page avant toute signature ou saisie d&apos;informations
                sensibles.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
