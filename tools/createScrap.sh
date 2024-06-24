#!/bin/bash
file_name=scrap
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
new_fileName=$file_name.$current_time

mv -f aetheryte_api_gateway/docker/volumes ~/scrap/aetheryte/$new_fileName
mv -f user_management/docker/volumes/db ~/scrap/user/$new_fileName
mv -f tournament/docker/volumes/db ~/scrap/tournament/$new_fileName
