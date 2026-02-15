class RessourceService:

    async def get_ressources(self):
        with open("Ressources/ressources.json") as f:
            return f.read()
