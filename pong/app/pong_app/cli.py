from argparse import ArgumentParser, Namespace
import subprocess, sys
import readline


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
        prog="Pong CLI",
        description="Offer different command to interact with the Pong game, such as initializing the game, stopping the game, resetting the game, and changing the controllers",
        epilog="Enjoy the game!",
    )

    # parser.add_argument('square', help='square a given number', type=int)

    # args: Namespace = parser.parse_args()

    # print(args.square ** 2)
    parser.add_argument("--state", help="Get current game state", action="store_true")

    parser.add_argument("--start", help="Start the game", action="store_true")

    parser.add_argument("--pause", help="Pause the game", action="store_true")

    parser.add_argument("--reset", help="Reset the game", action="store_true")

    parser.add_argument("--quit", help="Quit the program", action="store_true")

    parser.add_argument("--goals", type=int, help="Set how many points to win the game")

    # parser.add_argument('--set-right-up', type=int, help="Set key for up action on right paddle")

    # parser.add_argument('--set-right-down', type=int, help="Set key for down action on right paddle")
    # parser.add_argument('--set-left-up', type=int, help="Set key for up action on left paddle")

    # parser.add_argument('--set-left-down', type=int, help="Set key for down action on left paddle")

    parser.add_argument(
        "--set_keys_right",
        nargs=2,
        help="Set keys for up and down actions on right paddle",
    )
    parser.add_argument(
        "--set_keys_left",
        nargs=2,
        help="Set keys for up and down actions on left paddle",
    )

    # parser.add_argument('--', help='', action='store_true')

    # parser.add_argument('--', help='', action='store_true')
    args: Namespace = parser.parse_args("--help".split())

    while True:

        try:
            command = input(">> ")
            if (not history or command != history[-1]):
              history.append(command)
              readline.add_history(command)

            # print(history)
            args: Namespace = parser.parse_args(command.split())

            if args.start:
                subprocess.run(["curl", "http://localhost:9000/api/game_start"])
                print("Game state started")

            elif args.state:
                subprocess.run(["curl", "http://localhost:9000/api/game_state"])

            elif args.pause:
                subprocess.run(["curl", "http://localhost:9000/api/game_stop"])
                print("Game state paused")

            elif args.reset:
                subprocess.run(["curl", "http://localhost:9000/api/game_reset"])
                print("Score resetted")

            elif args.goals:
                subprocess.run(
                    [
                        "curl",
                        "-X",
                        "POST",
                        "-d",
                        f"points_to_win={args.goals}",
                        "http://localhost:9000/api/game_points",
                    ]
                )
                print(args.goals, "goals to win the game!")

            elif args.set_keys_right:
                if (
                    isinstance(args.set_keys_right, (list, tuple))
                    and len(args.set_keys_right) == 2
                    and all(
                        isinstance(key, str) and len(key) == 1
                        for key in args.set_keys_right
                    )
                ):
                    subprocess.run(
                        [
                            "curl",
                            "-X",
                            "POST",
                            "-d",
                            f"right_controller_up={args.set_keys_right[0]}",
                            "-d",
                            f"right_controller_down={args.set_keys_right[1]}",
                            "http://localhost:9000/api/right_controller",
                        ]
                    )
                else:
                    print(
                        "Invalid input for set_keys_right. It should be a list or tuple of exactly two single characters."
                    )

            elif args.set_keys_left:
                if (
                    isinstance(args.set_keys_left, (list, tuple))
                    and len(args.set_keys_left) == 2
                    and all(
                        isinstance(key, str) and len(key) == 1
                        for key in args.set_keys_left
                    )
                ):
                    subprocess.run(
                        [
                            "curl",
                            "-X",
                            "POST",
                            "-d",
                            f"left_controller_up={args.set_keys_left[0]}",
                            "-d",
                            f"left_controller_down={args.set_keys_left[1]}",
                            "http://localhost:9000/api/left_controller",
                        ]
                    )
                else:
                    print(
                        "Invalid input for set_keys_left. It should be a list or tuple of exactly two single characters."
                    )

            elif args.quit:
                print("Until next time fellow Ponger!")
                break

        except EOFError:
            # User pressed up arrow with no command history
            if history:
                command = history[-1]
                print(f"Last command: {command}")
            else:
                print("No command history")


if __name__ == "__main__":
    main()
