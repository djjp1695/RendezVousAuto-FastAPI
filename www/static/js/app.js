import VoitureManager from './Managers/VoitureManager.js';
import RessourcesService from './Services/RessourcesService.js';

const lienAPI = '/api';
const pages = { rendezVous: "rendezVous", voitures: "voitures", technicien: "technicien" };
const lang = 'fr';


class App {

    constructor() {
        this.voitureManager = new VoitureManager(lienAPI);
    }
    async chargerPage(hash) {
        $('#tiles-container').empty();

        if (window.initialStatusCode == 404) {
            this.afficherErreur404();

        }
        else {
            switch (hash) {
                case pages.rendezVous:
                    $('#contenuPages').text("Liste des rendez-vous");
                    break;
                case pages.voitures:
                    console.log(window.ressourcesService.getRessource(window.lang, 'voitures'));
                    await this.voitureManager.afficherVoitures();
                    break;
                case pages.technicien:
                    $('#contenuPages').text("Liste des techniciens");
                    break;
            }
        }

        this.ajusterSelonLangue();
    }

    ajusterSelonLangue() {
        $('#titrePrincipal').text(window.ressourcesService.getRessource(window.lang, 'titrePrincipal'));
        $('#voitures').text(window.ressourcesService.getRessource(window.lang, 'titreVoitures'));
        $('#rendezVous').text(window.ressourcesService.getRessource(window.lang, 'titreRendezVous'));
        $('#technicien').text(window.ressourcesService.getRessource(window.lang, 'titreTechniciens'));
        $('.modifier-voiture').text(window.ressourcesService.getRessource(window.lang, 'boutonModifier'));
        $('.supprimer-voiture').text(window.ressourcesService.getRessource(window.lang, 'boutonSupprimer'));
        $('.bouton-annuler').text(window.ressourcesService.getRessource(window.lang, 'boutonAnnuler'));
        $('.bouton-confirmer').text(window.ressourcesService.getRessource(window.lang, 'boutonConfirmer'));
        $('.marque-voiture').text(window.ressourcesService.getRessource(window.lang, 'marqueVoiture'));
        $('.modele-voiture').text(window.ressourcesService.getRessource(window.lang, 'modeleVoiture'));






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
    console.log("Initial status:", window.initialStatusCode);

    window.lang = lang;
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
        if (window.initialStatusCode != 404) {
            hash = window.location.hash.substring(1);
            $('a.pages').removeClass('active');
            $(`#${hash}`).addClass('active');
        }
        await app.chargerPage(hash);
    }

    await updatePage();

    $(window).on('hashchange', updatePage);
})();






