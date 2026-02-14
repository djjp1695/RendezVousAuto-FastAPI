import VoitureService from '../Services/VoitureService.js';
export default class VoitureManager {
    constructor() {
        this.voitureService = new VoitureService();
    }

    async getAllVoitures() {
        return await this.voitureService.getAll();
    }
}