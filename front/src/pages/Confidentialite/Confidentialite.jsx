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

      <h2>ARTICLE 7 : Cookies</h2>
      <p>
        Le site InkMaster utilise des cookies afin d’améliorer l’expérience utilisateur et de mesurer la fréquentation.
        Vous pouvez à tout moment refuser ou supprimer les cookies via les paramètres de votre navigateur.
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
