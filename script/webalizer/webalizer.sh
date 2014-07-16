#!/bin/env bash
#
# $Id: webalizer.sh 230 2014-05-09 02:13:46Z tommie $
#
# for Webalizer
#

LOG_DIR=/var/www/html/podCast/log
cat $LOG_DIR/apache-access-2014-02-14.log $LOG_DIR/apache-access.log >$LOG_DIR/apache-access-for-webalizer.log
exec /usr/bin/webalizer -Q

#EOF

