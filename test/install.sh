#
# $Id: install.sh 63 2013-01-10 20:33:30Z tommie $
#
PODCAST=/var/www/html/podCast

chown root $PODCAST/etc/cron.tab
service crond restart
service httpd restart

