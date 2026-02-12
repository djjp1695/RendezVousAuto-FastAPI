from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker


class DbContext:
    def __init__(self, filename):
        connection_string = f"sqlite+aiosqlite:///{filename}";
        self.__engine = create_async_engine(connection_string, echo=True)
        self.__sessionMaker = sessionmaker(bind=self.__engine, class_=AsyncSession)

    def get_session(self) -> AsyncSession:
        return self.__sessionMaker()
