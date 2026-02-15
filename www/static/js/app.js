import VoitureManager from './Managers/VoitureManager.js';

const lienAPI = '/api';
const pages = { rendezVous: "rendezVous", voitures: "voitures", technicien: "technicien" };
class App {

    constructor() {
        this.voitureManager = new VoitureManager(lienAPI);
    }


    async ouvrirModalActifInactif(element) {
        const modalWindow = $('#modal-window-voiture');
        modalWindow.find('.modal-body').empty();
        modalWindow.find('.modal-title')
            .text(`Rendre la voiture ${(element.actif) ? "inactive" : "inactive"}`);
        ;
        modalWindow.find('.modal-body')
            .append(
                $('<p>').text(`Marque : ${element.marque}`)
            )
            .append(
                $('<p>').text(`Modele : ${element.modele}`)
            )
            .append(
                $('<p>').text(`Année : ${element.annee}`)
            )
            .append(
                $('<p>').text(`Couleur : ${element.couleur}`)

            );
        modalWindow.find('#boutonConfirmer')
            .on('click', async () => {
                try {
                    const result = await this.voitureManager.rendreVoitureActifInactif(element.id, element.actif);
                    if (result) {
                        modalWindow.modal('hide');
                        location.reload();
                    }
                }
                catch (err) {
                    console.error(err);
                }
            })

        modalWindow.modal('show');

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

window.app = new App();

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






