DB_FILE="prisma/dev.db"


OUTPUT_DIR="audio_files"  # Directory to store the generated audio files

OUTPUT_DIR="audio_files"  # Directory to store the generated audio files
MAX_RETRIES=5  # Number of retries if the database is locked

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to query the database with retry logic
function query_db_with_retry() {
    local retries=0
    while [[ $retries -lt $MAX_RETRIES ]]; do
        result=$(sqlite3 "$DB_FILE" "SELECT id, english FROM Word WHERE audio IS NULL;")
        
        if [[ $? -eq 0 ]]; then
            echo "$result"
            return 0
        else
            echo "Database is locked, retrying... ($((retries + 1))/$MAX_RETRIES)"
            retries=$((retries + 1))
            sleep 1  # Wait for a second before retrying
        fi
    done
    
    echo "Failed to query database after $MAX_RETRIES retries."
    return 1
}

# Query the database
query_db_with_retry | while IFS="|" read -r id english; do
    if [[ -n "$id" && -n "$english" ]]; then
        echo "Generating audio for word ID $id: $english"
        espeak-ng -v en "$english" -w "$OUTPUT_DIR/$id.wav"
        
        # Optional: Update the database to associate the word with the generated audio file
        # sqlite3 "$DB_FILE" "UPDATE Word SET audio = '$OUTPUT_DIR/$id.wav' WHERE id = $id;"
    fi
done

echo "Audio generation complete!"