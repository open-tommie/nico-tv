#!/usr/bin/bash
#
# $Id: update.sh 235 2014-05-09 15:15:30Z tommie $
#
# usage:
#	update [dest-server]
#		dest-server:	destination server, default="sakura"
#

#DST_MACHINE="tommie@sakura"
DST_MACHINE=$1
DST_MACHINE=${DST_MACHINE:="sakura"}
#DST_MACHINE="vf3"
PORT=10022
#OPT="-rlptcvuz -e ssh --exclude-from="exclude.txt" --cvs-exclude"
OPT='-acvz -e ssh --exclude-from=exclude.txt --cvs-exclude'
CMD="rsync $OPT"

function update_abs() {
	FILE=$1
	FULL_PATH="${FILE}"
	COMMAND="$CMD $FULL_PATH ${DST_MACHINE}:$FULL_PATH"
	echo $COMMAND
	$COMMAND
}
function update_all() {
	FILE=$1
	FULL_PATH="${FILE}"
	COMMAND="$CMD $FULL_PATH ${DST_MACHINE}:$FULL_PATH"
	echo $COMMAND
	$COMMAND
}

tv="/var/www/html/tv/"
cat >exclude.txt <<_END_
+ /etc/profile.d/tommie.sh
+ etc/
+ script/chat/sample/
- script/node_module/
- script/socketio/
+ html/
- html/log.csv
- html/movie/
+ admin/
- admin/log.csv
- admin/usage/
+ test/Makefile
- test/*.txt
- test/*.sh
- test/*.md
- test/*.tpl
- test/*.py
- log/
- **.log
- **/log.html
- **.mp4
- **~
- **.pyc
_END_

LOG=$0.log
echo "----------`date`" >>$LOG
update_abs /etc/profile.d/tommie.sh |tee -a $LOG
update_all "$tv"|tee -a $LOG

#$CMD /usr/lib/python2.7/site-packages/sitecustomize.py	sakura:/usr/local/lib/python2.7/site-packages/


#update_all 	"etc/*.tab"
#update_all 	"etc/*.conf"
#update_all 	"script/check/*.py"
#update_all 	"script/check/*.sh"
#update_all 	"script/check/rssTemplate*.xml"
#update_all 	"script/access/*.py"
#update_all 	"script/access/*.sh"
#update_all 	"script/lib/*.py"
#update 			"test/install.sh"
#update 			"html/co1827022/index.html"

