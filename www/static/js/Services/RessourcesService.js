export default class RessourcesService {
    constructor(lienAPI) {
        this.lienAPI = lienAPI;
    }

    async fetchRessources() {
        try {
            const response = await fetch(`${this.lienAPI}/Ressources`)
            if (!response.ok) {
                console.error(response.status);
                throw new Error(`Failed to fetch resources: ${response.status}`);
            }

            const data = await response.json();
            this.ressources = data;
        }
        catch (err) {
            console.error(err);
        }
    }

    getRessource(lang, ressource) {
        return this.ressources[lang][0][ressource];
    }


}