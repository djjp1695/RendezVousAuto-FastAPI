class App {

    constructor() {
        this.VoitureManager = null;
        this.pages = { rendezVous: "rendezVous", voitures: "voitures", technicien: "technicien" };
    }

    async init() {
        const fichiers = [
            "static/Managers/VoitureManager.js",
            "static/Services/VoitureService.js"
        ];

        // Retourner une promesse qui attend le chargement complet
        for (const src of fichiers) {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Erreur de chargement : ${src}`));
                document.head.appendChild(script);
            });
        }

        this.voitureManager = new VoitureManager();
    }

    async chargerPage(hash) {
        $('#content').empty();
        switch (hash) {
            case this.pages.rendezVous:
                $('#contenuPages').text("Liste des rendez-vous");
                break;
            case this.pages.voitures:
                const template = await (await fetch('static/tile.html')).text();
                console.log(template);
                $('#contenuPages').text("Liste des voitures");
                const voitures = await this.voitureManager.getAllVoitures();
                voitures.forEach(element => {
                    const $tile = $(template); // crée le tile complet
                    $tile.find('.marque').text(`${element.marque}`);
                    $tile.find('.modele').text(`${element.modele}`);
                    $tile.find('.annee').text(`${element.annee}`);
                    $tile.find('.couleur').text(`${element.couleur}`);
                    $tile.click(() => {
                        alert(`Vous avez cliqué sur ${element.marque} ${element.modele}`);
                    });

                    $('#content').append($tile);
                });
                break;
            case this.pages.technicien:
                $('#contenuPages').text("Liste des techniciens");
                break;

        }
    }

}

(async () => {
    const app = new App();
    await app.init();

    // Si aucun hash, on force un hash par défaut
    if (!window.location.hash)
        window.location.hash = '#' + pages.rendezVous;

    async function updatePage() {
        const hash = window.location.hash.substring(1);
        $('a.pages').removeClass('active');
        $(`#${hash}`).addClass('active');
        await app.chargerPage(hash);
    }

    await updatePage();

    $(window).on('hashchange', updatePage);
})();






