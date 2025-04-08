import sys
import json
import urllib.parse

def load_save():
    encoded_data = sys.argv[1]
    user_id = sys.argv[2]

    decoded_data = urllib.parse.unquote(encoded_data)
    save = json.loads(decoded_data)
    sessions = save["sessionsData"]
    tasks = save["tasksData"]
    achievements = save["achievementsData"]

    sessions_file_path = f"/usr/share/nginx/html/data/{user_id}/sessions_{user_id}.json"
    tasks_file_path = f"/usr/share/nginx/html/data/{user_id}/tasks_{user_id}.json"
    achievements_file_path = f"/usr/share/nginx/html/data/{user_id}/achievements_{user_id}.json"
    
    with open(sessions_file_path, 'w') as file:
        json.dump(sessions, file, indent=4)
    
    print("sessions updated")

    
    with open(tasks_file_path, 'w') as file:
        json.dump(tasks, file, indent=4)
    
    print("tasks updated")

    
    with open(achievements_file_path, 'w') as file:
        json.dump(achievements, file, indent=4)
    
    print("achievements updated")

if __name__ == "__main__":
    load_save()
