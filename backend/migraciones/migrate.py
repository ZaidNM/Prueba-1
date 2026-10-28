"""Aplica las migraciones SQL pendientes de la carpeta sql/."""
import os
import re
from pathlib import Path

import pymysql
from dotenv import load_dotenv

RAIZ = Path(__file__).resolve().parent
load_dotenv(RAIZ.parent / ".env")

NOMBRE_BD = os.getenv("DB_NAME", "prueba_coches")


def conexion(con_base=True):
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=NOMBRE_BD if con_base else None,
        charset="utf8mb4",
        autocommit=True,
    )


def sentencias_de(archivo):
    lineas = [
        linea
        for linea in archivo.read_text(encoding="utf-8").splitlines()
        if not linea.strip().startswith("--")
    ]
    return [s.strip() for s in "\n".join(lineas).split(";") if s.strip()]


def main():
    if not re.fullmatch(r"[A-Za-z0-9_]+", NOMBRE_BD):
        raise SystemExit(f"DB_NAME invalido: {NOMBRE_BD}")

    # Crea la base si no existe (Workbench la muestra al refrescar)
    conexion_sin_bd = conexion(con_base=False)
    with conexion_sin_bd.cursor() as cursor:
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{NOMBRE_BD}` CHARACTER SET utf8mb4"
        )
    conexion_sin_bd.close()
    print(f"Base de datos: {NOMBRE_BD}")

    conn = conexion()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS _migraciones (
                nombre VARCHAR(255) PRIMARY KEY,
                aplicada_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute("SELECT nombre FROM _migraciones")
        aplicadas = {fila[0] for fila in cursor.fetchall()}

        for archivo in sorted((RAIZ / "sql").glob("*.sql")):
            if archivo.name in aplicadas:
                print(f"- {archivo.name} (ya aplicada)")
                continue

            for sentencia in sentencias_de(archivo):
                cursor.execute(sentencia)

            cursor.execute("INSERT INTO _migraciones (nombre) VALUES (%s)", (archivo.name,))
            print(f"OK {archivo.name}")

    conn.close()
    print("Migraciones al dia.")


if __name__ == "__main__":
    main()
