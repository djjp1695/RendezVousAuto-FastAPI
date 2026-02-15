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
                    const result = this.voitureManager.rendreVoitureActifInactif(element.id, element.actif);
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
                const template = await (await fetch('static/tile.html')).text();
                $('#contenuPages').text("Liste des voitures");
                const voitures = await this.voitureManager.getAllVoitures();
                if (voitures.length) {
                    voitures.forEach(element => {
                        const template = $('#card-template-voiture').html();
                        const $tile = $(template);
                        // Créer le corps de la card avec les informations
                        $tile.find('.card-title').text(element.marque);
                        $tile.find('.card-modele').text(`Modèle: ${element.modele}`);
                        $tile.find('.card-annee').text(`Année: ${element.annee}`);
                        $tile.find('.card-couleur').text(`Couleur: ${element.couleur}`);
                        $tile.find('.card-actif')
                            .text((element.actif) ? 'Actif' : 'Inactif');
                        $tile.find('.modifier-voiture')
                            .attr('id', element.id);
                        $tile.find('.actif-voiture')
                            .text((element.actif) ? 'Rendre inactif' : "Rendre actif")
                            .attr('id', element.id)
                            .on('click', async () => { await this.ouvrirModalActifInactif(element); });
                        // Ajouter le tile au conteneur
                        $('#tiles-container').append($tile);
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






