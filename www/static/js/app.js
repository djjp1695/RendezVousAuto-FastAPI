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

    ajusterSelonLangue() {
        $('#voitures').text(window.ressourcesService.getRessource(window.lang, 'voitures'));
        $('#rendezVous').text(window.ressourcesService.getRessource(window.lang, 'rendez-vous'));

    }
}


(async () => {
    const app = new App();
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
    if (!window.location.hash)
        window.location.hash = '#' + pages.rendezVous;

    async function updatePage() {
        const hash = window.location.hash.substring(1);
        $('a.pages').removeClass('active');
        $(`#${hash}`).addClass('active');
        await app.chargerPage(hash);
        app.ajusterSelonLangue();
    }

    await updatePage();

    $(window).on('hashchange', updatePage);
})();






