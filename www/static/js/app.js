import VoitureManager from './Managers/VoitureManager.js';
import RessourcesService from './Services/RessourcesService.js';

const codeErreurNotFound = 404;
const lienAPI = '/api';
const pages = { rendezVous: "rendezVous", voitures: "voitures", technicien: "technicien" };
const lang_defaut = 'fr';


class App {

    constructor() {
        this.voitureManager = new VoitureManager(lienAPI);
    }
    async chargerPage(hash) {


        $('#tiles-container').empty();
        this.activerBoutonLangue();
        if (window.initialStatusCode == codeErreurNotFound) {
            this.afficherErreur404();

        }
        else {
            switch (hash) {
                case pages.rendezVous:
                    $('#contenuPages').attr('class', 'liste-rendezVous');
                    break;
                case pages.voitures:
                    await this.voitureManager.afficherVoitures();
                    break;
                case pages.technicien:
                    $('#contenuPages').attr('class', 'liste-techniciens');
                    break;
            }
        }

        this.ajusterSelonLangue();
    }

    ajusterSelonLangue() {
        $('#titrePrincipal').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'titrePrincipal'));
        $('#voitures').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'titreVoitures'));
        $('#rendezVous').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'titreRendezVous'));
        $('#technicien').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'titreTechniciens'));
        $('.modifier-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'boutonModifier'));
        $('.supprimer-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'boutonSupprimer'));
        $('.bouton-annuler').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'boutonAnnuler'));
        $('.bouton-confirmer').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'boutonConfirmer'));
        $('.marque-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'marqueVoiture'));
        $('#marqueVoitureInput').attr('placeholder', window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'validationMarque'));
        $('.modele-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'modeleVoiture'));
        $('#modeleVoitureInput').attr('placeholder', window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'validationModele'));
        $('.annee-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'anneeVoiture'));
        $('#anneeVoitureInput').attr('placeholder', window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'validationAnnee'));
        $('.couleur-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'couleurVoiture'));
        $('#couleurVoitureInput').attr('placeholder', window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'validationCouleur'));
        $('#labelVoitureActive').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'voitureActive'));
        $('#modalLabelModificationVoiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'modificationVoiture'));
        $('.bouton-ajout-voiture').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'ajoutVoiture'));
        $('.liste-voitures').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'listeVoitures'));
        $('.liste-rendezVous').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'listeRendezVous'));
        $('.liste-techniciens').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'listeTechniciens'));
        $('.bouton-rendre-active').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'rendreActive'));
        $('.bouton-rendre-inactive').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'rendreInactive'));
        $('.label-card-model').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'modeleVoiture'));
        $('.label-card-annee').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'anneeVoiture'));
        $('.label-card-couleur').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'couleurVoiture'));
        $('.label-card-actif').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'actifVoiture'));
        $('.card-actif-actif').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'voitureActive'));
        $('.card-actif-inactif').text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'voitureInactive'));

    }

    activerBoutonLangue() {
        let langue = sessionStorage.getItem('lang');
        $('.btn-lang').removeClass('active');
        switch (langue) {
            case 'fr':
                $('.btn-fr').addClass('active')
                break;
            case 'en':
                $('.btn-en').addClass('active')
                break;
            case 'es':
                $('.btn-es').addClass('active')

        }
    }


    changerLangue(langue) {
        sessionStorage.setItem('lang', langue);
        this.activerBoutonLangue();
        this.ajusterSelonLangue();

    }


    afficherErreur404() {
        $('#tiles-container').empty();
        $('#contenuPages').text("Page non trouvée.");
        $('#contenuPages').append(
            $('<p>')
                .append(
                    $('<a>')
                        .attr('href', '/#rendezVous')
                        .text("Retour à l'accueil")
                )
        );


    }
}


(async () => {
    const app = new App();
    window.app = app;
    if (!sessionStorage.getItem('lang'))
        sessionStorage.setItem('lang', lang_defaut);

    try {
        let ressourcesService = new RessourcesService(lienAPI);
        await ressourcesService.fetchRessources();
        window.ressourcesService = ressourcesService;
    }
    catch (err) {
        console.error(err);
    }

    // Si aucun hash, on force un hash par défaut
    if (!window.location.hash && window.initialStatusCode != 404)
        window.location.hash = '#' + pages.rendezVous;

    async function updatePage() {
        let hash;
        if (window.initialStatusCode != codeErreurNotFound) {
            hash = window.location.hash.substring(1);
            $('a.pages').removeClass('active');
            $(`#${hash}`).addClass('active');
        }
        await app.chargerPage(hash);
    }

    await updatePage();

    $(window).on('hashchange', updatePage);
})();






