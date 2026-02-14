import VoitureService from '../Services/VoitureService.js';
export default class VoitureManager {
    constructor(lienApi) {
        this.voitureService = new VoitureService(lienApi);
    }

    async getAllVoitures() {
        return await this.voitureService.getAll();
    }
}