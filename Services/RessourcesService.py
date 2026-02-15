class RessourceService:

    def __init__(self, ressource_file):
        self.ressource_file = ressource_file

    async def get_ressources(self):
        with open(self.ressource_file, encoding='utf-8') as f:
            return f.read()
