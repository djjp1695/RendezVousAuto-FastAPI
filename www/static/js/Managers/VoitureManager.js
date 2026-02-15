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
}