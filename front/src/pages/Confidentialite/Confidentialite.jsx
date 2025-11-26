import React from "react";
import "./Confidentialite.css";

export default function Confidentialite() {
  return (
    <div className="confidentialite-container">
      <h1>Politique de Confidentialité & Conditions Générales d’Utilisation</h1>
      <p><strong>Dernière mise à jour :</strong> octobre 2025</p>

      <h2>ARTICLE 1 : Objet</h2>
      <p>
        Les présentes conditions générales d'utilisation (CGU) encadrent l’accès
        et l’utilisation du site <strong>InkMaster</strong>, vitrine officielle du salon de tatouage InkMaster,
        et de ses services associés (prise de rendez-vous, contact, consultation des artistes, etc.).
        Tout utilisateur reconnaît avoir pris connaissance et accepté ces conditions avant toute navigation sur le site.
      </p>

      <h2>ARTICLE 2 : Mentions légales</h2>
      <p>
        Le site <strong>InkMaster</strong> est édité par la société <strong>InkMaster Studio</strong>, 
        enregistrée sous le numéro SIRET XXXXXXXX, dont le siège social est situé au 24 rue de l’Art, 75010 Paris.
        Le directeur de publication est <strong>Webs Jean</strong>, représentant légal de la société.
      </p>

      <h2>ARTICLE 3 : Accès aux services</h2>
      <p>
        L’accès au site est gratuit pour tout utilisateur disposant d’un accès internet.
        Certains services, tels que la prise de rendez-vous ou la publication de tatouages,
        nécessitent la création d’un compte et une authentification sécurisée.
      </p>

      <h2>ARTICLE 4 : Responsabilités</h2>
      <p>
        L’utilisateur s’engage à fournir des informations exactes lors de son inscription et à ne pas diffuser de contenu illicite.
        InkMaster ne pourra être tenu responsable en cas de dysfonctionnement du site,
        d’interruption de service ou de perte de données indépendante de sa volonté.
      </p>

      <h2>ARTICLE 5 : Propriété intellectuelle</h2>
      <p>
        Tous les éléments du site (textes, images, logos, vidéos, codes sources) sont protégés par le droit d’auteur.
        Toute reproduction, modification ou diffusion sans autorisation est interdite.
      </p>

      <h2>ARTICLE 6 : Données personnelles</h2>
      <p>
        Conformément au RGPD, InkMaster collecte uniquement les données nécessaires à la gestion des rendez-vous,
        des avis et des comptes utilisateurs. Ces informations sont stockées de manière sécurisée.
        Vous disposez d’un droit d’accès, de rectification et de suppression de vos données
        via le formulaire de contact ou par e-mail à <strong>contact@inkmaster.fr</strong>.
      </p>

      <h2>ARTICLE 7 : Cookies & droit à l'oubli</h2>
      <p>
        Le site InkMaster utilise un cookie strictement nécessaire pour mémoriser votre consentement et, uniquement après votre accord, des cookies de mesure d’audience. Conformément au droit à l’oubli et au RGPD, vous pouvez retirer votre consentement ou demander la suppression de vos données personnelles (rendez-vous, avis, informations de compte) à tout moment. Pour exercer ces droits, contactez-nous via le formulaire de contact ou à <strong>contact@inkmaster.fr</strong>; nous supprimerons alors vos données et désactiverons les éventuels cookies associés dans les meilleurs délais.
      </p>

      <h2>ARTICLE 8 : Droit applicable</h2>
      <p>
        Le présent contrat est soumis au droit français. En cas de litige, les tribunaux compétents
        du ressort de Paris seront seuls compétents.
      </p>

      <p className="footer-note">
        © {new Date().getFullYear()} InkMaster Studio – Tous droits réservés.
      </p>
    </div>
  );
}
