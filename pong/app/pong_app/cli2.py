from argparse import ArgumentParser, Namespace
import subprocess, sys
import readline
import json
import requests
import jwt
import getpass
import warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning

warnings.simplefilter("ignore", InsecureRequestWarning)


def connect_to_pong_project():
    username = input("Enter your username: ")
    password = getpass.getpass("Enter your password: ")

    url = "https://localhost:10443/api/login/token/"
    headers = {"Accept": "application/json", "Content-Type": "application/json"}
    data = {"username": username, "password": password}
    response = requests.post(url, headers=headers, data=json.dumps(data), verify=False)

    if response.status_code == 200:
        data = response.json()
        token = data["access"]
        decoded = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded["user_id"]
        return token, user_id, username
    else:
        print("Incorrect credentials.")
        return False


def create_game(user_connected, token):
    url = f"https://localhost:10443/api/pong/create-game/{user_connected}/LOCAL_TWO_PLAYERS/0/"
    headers = {"Accept": "application/json", "Content-Type": "application/json"}
    response = requests.get(
        url, headers=headers, verify=False, cookies={"csrftoken": token}
    )

    if response.status_code == 200:
        data = response.json()
        game_id = data["game_id"]
        print(f"Game created with user {user_connected}: {game_id}")
        return game_id
    else:
        print("Failed to create game.")
        print(response.status_code, response.text)
        return None


class NonExitingArgumentParser(ArgumentParser):
    def print_help(self):
        super().print_help()

    def exit(self, status=0, message=None):
        if status:
            super().exit(status, message)

    def error(self, message):
        self.print_usage(sys.stderr)
        print(f"Unknown command: {message}")


def main():

    history = []

    parser = NonExitingArgumentParser(
        description="small interface to interact with local games!",
    )

    parser.add_argument(
        "-q", "--quit", help="quit the command line interface", action="store_true"
    )

    parser.add_argument(
        "-c",
        "--connect",
        help="enter your credentials to pong project",
        action="store_true",
    )

    parser.add_argument(
        "-ng", "--new_game", help="create a new local game", action="store_true"
    )

    parser.add_argument(
        "-sg", "--start-game", help="only available when connected to a game: start the game", action="store_true"
    )

    parser.add_argument(
        "-pg", "--pause-game", help="only available when connected to a game: pause the game", action="store_true"
    )

    parser.print_help()

    args = parser.parse_args()

    user_connected = None
    user_connected_to_game = False
    current_game_id = None
    username = None
    tk = None

    while True:

        command = input(">> ")
        if command == "q":
            print("Quitting the CLI")
            sys.exit(0)

        elif command == "c":
            tk, user_connected, username = connect_to_pong_project()
            if user_connected:
                print(f"Success on connection with user: {username}")

        elif user_connected and command == "ng":
            current_game_id = create_game(user_connected, token=tk)
            if current_game_id:
                user_connected_to_game = True
                while user_connected_to_game:  # start a new command loop
                    game_command = input("Game >> ")  # get a command from the user
                    if game_command == "dc":
                        user_connected_to_game = False
                        current_game_id = None
                        print("Disconnected from game")
                    else:
                        print("Unknown command when connected to a game")
                        parser.print_help()
        else:
            print("Unknown command")
            parser.print_help()

        if not history or command != history[-1]:
            history.append(command)
            readline.add_history(command)


if __name__ == "__main__":
    main()

# Handle the fact that you can create a local game and connect to this game with another user via browser
# How to not permit soemone to connect to a game that is not the creator
