import sys
import json
import urllib.parse

def update_achievements():
    encoded_data = sys.argv[1]
    user_id = sys.argv[2]

    decoded_data = urllib.parse.unquote(encoded_data)
    achievements = json.loads(decoded_data)
    
    file_path = f"/usr/share/nginx/html/data/{user_id}/achievements_{user_id}.json"
    
    with open(file_path, 'w') as file:
        json.dump(achievements, file, indent=4)
    
    print("achievements updated")

if __name__ == "__main__":
    update_achievements()
