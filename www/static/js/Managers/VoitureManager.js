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
            console.error('Error toggling car status:', error);
            throw new Error('Failed to update car status');
        }
    }

    async modifierVoiture(id, marque, modele, annee, couleur, actif) {
        try {
            const response = await this.voitureService.updateVoiture(id, marque, modele, annee, couleur, actif);
            return response;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to update car infos");
        }
    }

    async ajouterVoiture(marque, modele, annee, couleur, actif) {
        try {
            const response = await this.voitureService.ajouterVoiture(marque, modele, annee, couleur, actif);
            return response;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to update car infos");
        }
    }

    async supprimerVoiture(id) {
        try {
            const response = await this.voitureService.supprimerVoiture(id);
            return response;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to delete car");
        }
    }

    async ouvrirModalActifInactifSuppresion(element, suppression) {
        const modalWindow = $('#modal-window-voiture');
        modalWindow.find('#boutonConfirmer').off('click');

        modalWindow.find('.modal-body').empty();
        if (!suppression)
            modalWindow.find('.modal-title')
                .text(`Rendre la voiture ${(element.actif) ? "inactive" : "inactive"}`);
        else
            modalWindow.find('.modal-title')
                .text('Suppression de la voiture');

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
            modalWindow.find('#marqueVoiture').val(element.marque);
            modalWindow.find('#modeleVoiture').val(element.modele);
            modalWindow.find('#anneeVoiture').val(element.annee);
            modalWindow.find('#couleurVoiture').val(element.couleur);
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
                            modalWindow.find('#marqueVoiture').val(),
                            modalWindow.find('#modeleVoiture').val(),
                            modalWindow.find('#anneeVoiture').val(),
                            modalWindow.find('#couleurVoiture').val(),
                            modalWindow.find('#actifVoiture').prop('checked')
                        );
                    }
                    else {
                        result = await this.ajouterVoiture(
                            modalWindow.find('#marqueVoiture').val(),
                            modalWindow.find('#modeleVoiture').val(),
                            modalWindow.find('#anneeVoiture').val(),
                            modalWindow.find('#couleurVoiture').val(),
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
        // Append the "Ajouter" button
        $('#tiles-container').append(
            $('<button>')
                .text('Ajouter une voiture')
                .on('click', () => {
                    this.ouvrirModalModificationAjout(null, false);

                })
        );


        $('#contenuPages').text("Liste des voitures");
        let voitures = await this.getAllVoitures();
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
                    .on('click', async () => { await this.ouvrirModalModificationAjout(element, true); });
                $tile.find('.actif-voiture')
                    .text((element.actif) ? 'Rendre inactif' : "Rendre actif")
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
                    .text("Erreur de lors de la recherche des voitures")
                    .css('color', 'red')
            );
    }
}