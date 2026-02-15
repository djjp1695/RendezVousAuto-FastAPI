export default class VoitureService {

    constructor(lienAPI) {
        this.lienAPI = lienAPI;
    }

    async getAll() {
        try {
            const response = await fetch(`${this.lienAPI}/Voitures`)
            if (!response.ok)
                console.error(response.status);
            const data = await response.json();
            return data;
        }
        catch (err) {
            console.error(err);
        }
    }

    async updateVoitureStatus(id, actif) {
        try {
            const response = await fetch(`${this.lienAPI}/Voitures/${id}/status?actif=${actif}`,
                {
                    method: 'PUT'
                })
            if (!response.ok)
                console.error(response.status);
            else {
                const data = await response.json();
                return data;
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}