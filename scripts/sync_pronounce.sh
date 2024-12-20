DB_FILE="prisma/dev.db"

sqlite3 "$DB_FILE" "SELECT english FROM Word WHERE audio IS NULL;"

espeak-ng -v en "This is a text"