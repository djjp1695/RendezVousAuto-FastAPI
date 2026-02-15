import VoitureManager from './Managers/VoitureManager.js';

const lienAPI = '/api';
const pages = { rendezVous: "rendezVous", voitures: "voitures", technicien: "technicien" };



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
                await this.voitureManager.afficherVoitures();
                break;
            case pages.technicien:
                $('#contenuPages').text("Liste des techniciens");
                break;
        }
    }
}

const app = new App();

(async () => {
    // Si aucun hash, on force un hash par défaut
    if (!window.location.hash)
        window.location.hash = '#' + pages.rendezVous;

    async function updatePage() {
        const hash = window.location.hash.substring(1);
        $('a.pages').removeClass('active');
        $(`#${hash}`).addClass('active');
        await app.chargerPage(hash);
    }

    await updatePage();

    $(window).on('hashchange', updatePage);
})();






