import VoitureManager from './Managers/VoitureManager.js';

const lienAPI = '/api';
const pages = { rendezVous: "rendezVous", voitures: "voitures", technicien: "technicien" };



class App {

    constructor() {
        this.voitureManager = new VoitureManager(lienAPI);
    }

    async chargerPage(hash) {
        $('#content').empty();
        switch (hash) {
            case pages.rendezVous:
                $('#contenuPages').text("Liste des rendez-vous");
                break;
            case pages.voitures:
                const template = await (await fetch('static/tile.html')).text();
                $('#contenuPages').text("Liste des voitures");
                const voitures = await this.voitureManager.getAllVoitures();
                if (voitures.length) {
                    voitures.forEach(element => {
                        const $tile = $(template); // crée le tile complet
                        $tile.find('.marque').text(`${element.marque}`);
                        $tile.find('.modele').text(`${element.modele}`);
                        $tile.find('.annee').text(`${element.annee}`);
                        $tile.find('.couleur').text(`${element.couleur}`);
                        $tile.click(() => {
                            alert(`Vous avez cliqué sur ${element.marque} ${element.modele}`);
                        });

                        $('#content').append($tile);
                    });
                }
                else
                    $('#content').append(
                        $('<h3>')
                            .text("Erreur de lors de la recherche des voitures")
                            .css('color', 'red')
                    );
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






