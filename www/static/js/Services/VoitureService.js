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

    async updateVoiture(id, marque, modele, annee, couleur, actif) {
        try {
            const response = await fetch(`${this.lienAPI}/Voitures/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        marque: marque,
                        modele: modele,
                        annee: annee,
                        couleur: couleur,
                        actif: actif
                    })
                });
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

    async ajouterVoiture(marque, modele, annee, couleur, actif) {
        try {
            const response = await fetch(`${this.lienAPI}/Voitures/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        marque: marque,
                        modele: modele,
                        annee: annee,
                        couleur: couleur,
                        actif: actif
                    })
                });
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

    async supprimerVoiture(id) {
        try {
            const response = await fetch(`${this.lienAPI}/Voitures/${id}`,
                {
                    method: 'DELETE'
                });
            if (!response.ok)
                console.error(response.status);
            else {
                const data = response.status;
                return data;
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}