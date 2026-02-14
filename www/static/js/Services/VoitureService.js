export default class VoitureService {
    async getAll() {
        try {
            const response = await fetch('/Voitures')
            if (!response.ok)
                console.error(response.status);
            const data = await response.json();
            return data;
        }
        catch (err) {
            console.error(err);
        }

    }
}