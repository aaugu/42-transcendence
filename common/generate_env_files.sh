#!/bin/bash

echo "-------------------- GENERATING ENV FILES... --------------------"

ENV_PATH='.env'
AETHERYTE_ENV_FILE='aetheryte_api_gateway/app/.env'
TOURNAMENT_ENV_FILE='tournament/app/.env'
LIVECHAT_ENV_FILE='livechat/app/.env'

if [ -f $AETHERYTE_ENV_FILE ]; then
    rm $AETHERYTE_ENV_FILE
fi

if [ -f $TOURNAMENT_ENV_FILE ]; then
    rm $TOURNAMENT_ENV_FILE
fi

if [ -f $LIVECHAT_ENV_FILE ]; then
    rm $LIVECHAT_ENV_FILE
fi

while IFS= read -r line
	do
		if [[ $line = *'AETHERYTE'* ]]; then
			echo $line >> $AETHERYTE_ENV_FILE
		elif [[ $line = *'TOURNAMENT'* ]]; then
			echo $line >> $TOURNAMENT_ENV_FILE
		elif [[ $line = *'LIVECHAT'* ]]; then
			echo $line >> $LIVECHAT_ENV_FILE
		fi
	done < $ENV_PATH