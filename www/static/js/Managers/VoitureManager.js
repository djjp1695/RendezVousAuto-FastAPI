import VoitureService from '../Services/VoitureService.js';
export default class VoitureManager {
    constructor(lienApi) {
        this.voitureService = new VoitureService(lienApi);

        $('#updateVoitureForm').on('submit', function (e) {
            e.preventDefault();
        });
    }

    async getAllVoitures() {
        return await this.voitureService.getAll();
    }
    async rendreVoitureActifInactif(id, actif) {
        try {
            // Call the VoitureService to update the car status in the backend
            const response = await this.voitureService.updateVoitureStatus(id, !actif); // Toggle the status
            return response;
        } catch (error) {
            console.error(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'erreurMiseAJourVoiture'), error);
            throw new Error(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'erreurMiseAJourVoiture'));
        }
    }

    async modifierVoiture(id, marque, modele, annee, couleur, actif) {
        try {
            const response = await this.voitureService.updateVoiture(id, marque, modele, annee, couleur, actif);
            return response;
        } catch (error) {
            console.error(error)
            throw new Error(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'erreurMiseAJourVoiture'));
        }
    }

    async ajouterVoiture(marque, modele, annee, couleur, actif) {
        try {
            const response = await this.voitureService.ajouterVoiture(marque, modele, annee, couleur, actif);
            return response;
        } catch (error) {
            console.error(error)
            throw new Error(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'erreurMiseAJourVoiture'));
        }
    }

    async supprimerVoiture(id) {
        try {
            const response = await this.voitureService.supprimerVoiture(id);
            return response;
        } catch (error) {
            console.error(error)
            throw new Error(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'erreurSuppresionVoiture'));
        }
    }

    async ouvrirModalActifInactifSuppresion(element, suppression) {
        const modalWindow = $('#modal-window-voiture');
        modalWindow.find('#boutonConfirmer').off('click');

        modalWindow.find('.modal-body').empty();
        if (!suppression)
            modalWindow.find('.modal-title')
                .text(`${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'rendreVoiture')} 
                ${(element.actif)
                        ? `${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'voitureInactive').toLowerCase()}`
                        : `${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'voitureActive').toLowerCase()}`}`);
        else
            modalWindow.find('.modal-title')
                .text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'suppresionVoiture'));

        modalWindow.find('.modal-body')
            .append(
                $('<p>').text(`${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'marqueVoiture')} : ${element.marque}`)
            )
            .append(
                $('<p>').text(`${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'modeleVoiture')} : ${element.modele}`)
            )
            .append(
                $('<p>').text(`${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'anneeVoiture')} : ${element.annee}`)
            )
            .append(
                $('<p>').text(`${window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'couleurVoiture')} : ${element.couleur}`)

            );
        modalWindow.find('#boutonConfirmer')
            .on('click', async () => {
                try {
                    let result;
                    if (!suppression) {
                        result = await this.rendreVoitureActifInactif(element.id, element.actif);
                    }
                    else {
                        result = await this.supprimerVoiture(element.id);
                        console.log(result);
                    }
                    if (result) {
                        modalWindow.modal('hide');
                        this.afficherVoitures();
                    }
                }
                catch (err) {
                    console.error(err);
                }
            })

        modalWindow.modal('show');

    }

    async ouvrirModalModificationAjout(element, modification) {
        $('#updateVoitureForm')[0].reset();

        const modalWindow = $('#modal-window-modification-voiture');
        if (modification) {
            modalWindow.find('#boutonConfirmer').off('click');
            modalWindow.find('#marqueVoitureInput').val(element.marque);
            modalWindow.find('#modeleVoitureInput').val(element.modele);
            modalWindow.find('#anneeVoitureInput').val(element.annee);
            modalWindow.find('#couleurVoitureInput').val(element.couleur);
            modalWindow.find('#actifVoiture').prop('checked', element.actif);
        }

        modalWindow.find('#boutonConfirmer')
            .on('click', async () => {
                const form = $('#updateVoitureForm')[0];

                if (!form.checkValidity()) {
                    // Si le formulaire est invalide, n'envoyer pas la requête
                    // Afficher le message d'erreur pour chaque champ invalide
                    form.reportValidity();
                    return;
                }
                try {
                    let result;
                    if (modification) {
                        result = await this.modifierVoiture(
                            element.id,
                            modalWindow.find('#marqueVoitureInput').val(),
                            modalWindow.find('#modeleVoitureInput').val(),
                            modalWindow.find('#anneeVoitureInput').val(),
                            modalWindow.find('#couleurVoitureInput').val(),
                            modalWindow.find('#actifVoiture').prop('checked')
                        );
                    }
                    else {
                        result = await this.ajouterVoiture(
                            modalWindow.find('#marqueVoitureInput').val(),
                            modalWindow.find('#modeleVoitureInput').val(),
                            modalWindow.find('#anneeVoitureInput').val(),
                            modalWindow.find('#couleurVoitureInput').val(),
                            modalWindow.find('#actifVoiture').prop('checked')
                        );
                    }

                    if (result) {
                        modalWindow.modal('hide');
                        this.afficherVoitures();
                    }
                }
                catch (err) {
                    console.error(err);
                }
            })

        modalWindow.modal('show');

    }

    async afficherVoitures() {
        $('#tiles-container').empty();
        $('#tiles-container').append(
            $('<button>')
                .attr('class', 'bouton-ajout-voiture')
                .on('click', () => {
                    this.ouvrirModalModificationAjout(null, false);

                })
        );


        $('#contenuPages').attr('class', 'liste-voitures');
        let voitures = await this.getAllVoitures();
        if (voitures.length) {
            voitures.forEach(element => {
                const template = $('#card-template-voiture').html();
                const $tile = $(template);
                // Créer le corps de la card avec les informations
                $tile.find('.card-title').text(element.marque);
                $tile.find('#card-modele').text(`${element.modele}`);
                $tile.find('#card-annee').text(`${element.annee}`);
                $tile.find('#card-couleur').text(`${element.couleur}`);
                $tile.find('#card-actif')
                    .addClass(
                        (element.actif)
                            ? 'card-actif-actif'
                            : 'card-actif-inactif'
                    );
                $tile.find('.modifier-voiture')
                    .on('click', async () => { await this.ouvrirModalModificationAjout(element, true); });
                $tile.find('.actif-voiture')
                    .addClass(
                        (element.actif)
                            ? 'bouton-rendre-inactive'
                            : 'bouton-rendre-active')
                    .on('click', async () => { await this.ouvrirModalActifInactifSuppresion(element, false); });
                $tile.find('.supprimer-voiture')
                    .on('click', async () => { await this.ouvrirModalActifInactifSuppresion(element, true); });
                // Ajouter le tile au conteneur
                $('#tiles-container').append($tile);
            });


        }
        else
            $('#content').append(
                $('<h3>')
                    .text(window.ressourcesService.getRessource(sessionStorage.getItem('lang'), 'erreurRechercheVoitures'))
                    .css('color', 'red')
            );
        window.app.ajusterSelonLangue();

    }

}