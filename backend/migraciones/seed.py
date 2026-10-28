"""Carga marcas, coches y el usuario admin. Se puede ejecutar varias veces."""
import os
from pathlib import Path

import bcrypt
import pymysql
from dotenv import load_dotenv

RAIZ = Path(__file__).resolve().parent
load_dotenv(RAIZ.parent / ".env")

MARCAS = [
    "Ferrari",
    "McLaren",
    "Porsche",
    "Renault",
    "Opel",
    "Peugeot",
    "Toyota",
    "Suzuki",
    "Kia",
    "Volkswagen",
    "Ford",
]

COCHES = [
    ("Ferrari", "488 GTB", 2021, 320000, "Rojo", 2, "gasolina", "/imagenes/Ferrari.jpg"),
    ("McLaren", "720S", 2022, 350000, "Naranja", 2, "gasolina", "/imagenes/mclaren.webp"),
    ("Porsche", "911 Carrera", 2023, 420000, "Plata", 2, "gasolina", "/imagenes/pornch.jpg"),
    ("Renault", "Kwid", 2024, 45000, "Blanco", 4, "gasolina", "/imagenes/kwid.jpg"),
    ("Opel", "Corsa", 2019, 38000, "Azul", 4, "gasolina", "/imagenes/opel-corsa.jpg"),
    ("Peugeot", "208", 2022, 62000, "Gris", 4, "gasolina", "/imagenes/PEPER.webp"),
    ("Toyota", "Corolla", 2023, 85000, "Blanco", 4, "hibrido", "/imagenes/toyota.jpeg"),
    ("Suzuki", "Swift", 2022, 55000, "Rojo", 4, "gasolina", "/imagenes/Zusiki.jpg"),
    ("Kia", "Carnival", 2023, 120000, "Negro", 5, "diesel", "/imagenes/Miniban.jpg"),
    ("Volkswagen", "Beetle", 1975, 30000, "Verde", 2, "gasolina", "/imagenes/sapito.jpg"),
    ("Ford", "Ranger", 2022, 140000, "Gris", 4, "diesel", "/imagenes/Camioneta.jpg"),
]


def conexion():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "prueba_coches"),
        charset="utf8mb4",
        autocommit=True,
    )


def main():
    conn = conexion()

    with conn.cursor() as cursor:
        for nombre in MARCAS:
            cursor.execute(
                "INSERT INTO marcas (nombre) VALUES (%s) "
                "ON DUPLICATE KEY UPDATE nombre = nombre",
                (nombre,),
            )

        cursor.execute("SELECT id, nombre FROM marcas")
        ids = {nombre: id_marca for id_marca, nombre in cursor.fetchall()}

        for marca, modelo, anio, precio, color, puertas, combustible, imagen in COCHES:
            cursor.execute(
                """
                INSERT IGNORE INTO coches
                    (marca_id, modelo, anio, precio, color, puertas, combustible, imagen)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (ids[marca], modelo, anio, precio, color, puertas, combustible, imagen),
            )

        password = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()
        cursor.execute(
            "INSERT INTO usuarios (email, password) VALUES (%s, %s) "
            "ON DUPLICATE KEY UPDATE email = email",
            ("admin@prueba.com", password),
        )

        cursor.execute("SELECT COUNT(*) FROM coches")
        total = cursor.fetchone()[0]

    conn.close()
    print(f"Seed listo: {len(MARCAS)} marcas, {total} coches")
    print("Login: admin@prueba.com / admin123")


if __name__ == "__main__":
    main()
