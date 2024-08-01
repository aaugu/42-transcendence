from argparse import ArgumentParser, Namespace
import subprocess, sys

class NonExitingArgumentParser(ArgumentParser):
  def print_help(self):
    super().print_help()

  def exit(self, status=0, message=None):
    if status:
      super().exit(status, message)

  def error(self, message):
    self.print_usage(sys.stderr)
    print(f'Unknown command: {message}')

def main():
  parser = NonExitingArgumentParser(prog='Pong CLI', description='Offer different command to interact with the Pong game, such as initializing the game, stopping the game, resetting the game, and changing the controllers', epilog='Enjoy the game!')

  # parser.add_argument('square', help='square a given number', type=int)

  # args: Namespace = parser.parse_args()

  # print(args.square ** 2)
  parser.add_argument('--state', help='Get current game state', action='store_true')

  parser.add_argument('--start', help='Start the game', action='store_true')

  parser.add_argument('--pause', help='Pause the game', action='store_true')

  parser.add_argument('--reset', help='Reset the game', action='store_true')

  parser.add_argument('--quit', help='Quit the program', action='store_true')

  parser.add_argument('--goals', type=int, help='Set how many points to win the game')

  # parser.add_argument('--', help='', action='store_true')

  # parser.add_argument('--', help='', action='store_true')
  args: Namespace = parser.parse_args("--help".split())

  while True:
    args: Namespace = parser.parse_args(input("Enter a command: ").split())

    if (args.start):
        subprocess.run(['curl', 'http://localhost:9000/api/game_start'])
        print('Game state started')

    elif (args.state):
        subprocess.run(['curl', 'http://localhost:9000/api/game_state'])

    elif (args.pause):
        subprocess.run(['curl', 'http://localhost:9000/api/game_stop'])
        print('Game state paused')

    elif (args.reset):
        subprocess.run(['curl', 'http://localhost:9000/api/game_reset'])
        print('Score resetted')
    elif args.goals:
        subprocess.run(['curl', '-X', 'POST', '-d', f'points_to_win={args.goals}', 'http://localhost:9000/api/game_points'])

    elif (args.quit):
        print("Until next time fellow Ponger!")
        break

if __name__ == '__main__':
  main()