import VoitureService from '../Services/VoitureService.js';
export default class VoitureManager {
    constructor(lienApi) {
        this.voitureService = new VoitureService(lienApi);
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

    async afficherVoitures() {
        $('#tiles-container').html('');
        $('#contenuPages').text("Liste des voitures");
        const voitures = await this.getAllVoitures();
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
                    .on('click', async () => { await app.ouvrirModalActifInactif(element); });
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