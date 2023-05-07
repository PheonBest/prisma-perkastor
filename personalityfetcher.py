import requests
import sys
import json
import signal
def save_facts_and_exit(signal_number, frame):
    print("\nInterrupted by user. Saving facts and exiting...")
    with open('data.json', 'w', encoding="utf-8") as outfile:
        json.dump(data, outfile, indent=4, ensure_ascii=False)
    sys.exit(1)

def get_person_info(name: str):
    # Effectuer une requête pour récupérer l'ID Wikidata de la personnalité
    url = 'https://www.wikidata.org/w/api.php'
    params = {
        'action': 'query',
        'format': 'json',
        'list': 'search',
        'srsearch': name,
        'srprop': 'size',
        'utf8': 1,
    }
    response = requests.get(url, params=params)
    results = response.json()['query']['search']
    if len(results) == 0:
        print(f"Aucune personnalité trouvée pour le nom '{name}'.")
        return None
    wikidata_id = results[0]['title'].replace('Q', '')

    # Effectuer une requête pour récupérer la date de naissance, de mort, la description et l'image de la personnalité
    url = 'https://www.wikidata.org/w/api.php'
    params = {
        'action': 'wbgetentities',
        'format': 'json',
        'ids': f'Q{wikidata_id}',
        'props': 'labels|descriptions|claims',
        'languages': 'fr',
    }
    response = requests.get(url, params=params)
    entity = response.json()['entities'][f'Q{wikidata_id}']
    if 'P569' in entity['claims']:
        birth_date = entity['claims']['P569'][0]['mainsnak']['datavalue']['value']
    else:
        birth_date = None
        return None
    if 'P570' in entity['claims']:
        death_date = entity['claims']['P570'][0]['mainsnak']['datavalue']['value']
    else:
        death_date = None
    if 'fr' in entity['descriptions']:
        description = entity['descriptions']['fr']['value']
    else:
        description = None
    if 'P18' in entity['claims']:
        file_name = entity['claims']['P18'][0]['mainsnak']['datavalue']['value']
        image_url = f'https://commons.wikimedia.org/wiki/File:{file_name.replace(" ", "_")}'
    else:
        image_url = None
    if 'fr' in entity['labels']:
        name = entity['labels']['fr']['value']
    else:
        name = None
    return ("Q"+wikidata_id, {
        "birth_date": birth_date,
        "death_date": death_date,
        "description": description,
        "image_url": image_url,
        "name" : name
    })

with open("./data/persons.json", "r", encoding="utf-8") as f:
    persons = json.load(f)
data = {}
signal.signal(signal.SIGINT, save_facts_and_exit)
signal.signal(signal.SIGTERM, save_facts_and_exit)

import time
import concurrent.futures

# Utilisez un ThreadPoolExecutor pour exécuter plusieurs appels à get_city_streets() en parallèle
with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
    # Récupérez les rues pour chaque ville dans la liste "cities"
    future_to_city = {executor.submit(get_person_info, person): person for person in persons}
    
    # Parcourez les résultats des threads et ajoutez-les à la liste "data"
    for future in concurrent.futures.as_completed(future_to_city):
        try:
            tuple = future.result()
            if tuple is not None:
                key, person_data = tuple
                data[key] = person_data
                print(f"Données récupérées pour la personnalité {person_data['name']}")
        except Exception as e:
            print(f"Erreur lors de l'exécution du thread: {e}")
        time.sleep(0.3)


# Enregistrez les données dans un fichier JSON
with open('data4.json', 'w') as outfile:
    json.dump(data, outfile)
    