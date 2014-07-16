#
# Makefile for tv
# $Id: Makefile 235 2014-05-09 15:15:30Z tommie $
#
project		:= tv
prefix		:= ..
abs_prefix	:= /var/www/html/tv
host		:=	$(shell hostname)
log_dir		:= $(prefix)/log
html_dir	:= $(prefix)/html
script_dir		:= $(prefix)/script
check_dir		:= $(prefix)/script/check
webalizer_dir	:= $(prefix)/script/webalizer
test_dir	:= $(prefix)/test
access_log	:= $(log_dir)/apache-access.log
error_log	:= $(log_dir)/apache-error.log
logs		:= $(access_log) $(error_log)
httpd_conf_dir		:=	/etc/httpd/conf.d
httpd_conf_grobal	:= $(httpd_conf_dir)/$(project).conf
httpd_conf_local	:=	$(prefix)/etc/httpd.conf

mod			:= 0644
#mod_log		:= 0666
mod_log		:= 0644
#mod_exe		:= 0754
mod_exe		:= 0750
mod_cgi		:= 0755
mod_dir		:= 0755
own			:= tommie
grp			:= apache
inst		:= install -m $(mod) -g $(grp) -p
chmod		:=	chmod $(mod) 
chgrp		:=	chgrp $(grp)

.SUFFIXES:	.js .json

.js.json:
	node $< >$@

.PHONY : all install clean start chmod ln json
	
	
all: ../html/index.html install $(httpd_conf_grobal) json
	
../html/index.html: index.md index.tpl md2html.py
	./md2html.py
	mv index.html ../html/

install: $(log_dir) $(access_log) $(error_log) $(httpd_conf_grobal)
	
restart:
	@echo "host="$(host)
ifeq ($(host),tommie2.info)
	sudo service httpd restart
else
	sudo systemctl restart httpd.service
endif

chmod:
	sudo chown root:root $(prefix)/etc/cron.tab /etc/cron.d/$(project).tab
	find $(prefix) -type f -exec chmod $(mod) {} \;
	find $(prefix) -type d -exec chmod $(mod_dir) {} \;
	find $(prefix) -name "*.log" -type f -exec chmod $(mod_log) {} \;
	find $(prefix) -name "*.sh" -type f -exec chmod $(mod_exe) {} \;
	find $(prefix) -name "*.py" -type f -exec chmod $(mod_exe) {} \;
	find $(html_dir) -name "*.php" -type f -exec chmod $(mod_cgi) {} \;
	find $(prefix)/admin/usage -name "*" -type f -exec chown tommie:tommie {} \;
	find $(prefix)/admin/usage -name "*" -type f -exec chmod $(mod) {} \;
	chmod $(mod_exe) $(script_dir)/lib/nicovideo-dl

clean:
	rm -i $(access_log) $(error_log)
	rmdir $(log_dir)

$(log_dir):
	test -d $(log_dir) || mkdir $(log_dir)
	$(chgrp)  $(log_dir)
	chmod $(mod_log) $(log_dir)

$(error_log):
	echo >$(error_log)
	$(chgrp)  $(error_log)
	chmod $(mod_log) $(error_log)

$(access_log):
	echo >$(access_log)
	$(chgrp)  $(access_log)
	chmod $(mod_log) $(access_log)

#ln: $(httpd_conf_grobal) /etc/webalizer.conf $(httpd_conf_dir)/webalizer-httpd.conf \
#	/etc/sysconfig/webalizer /etc/cron.daily/webalizer

ln_target 	:= $(httpd_conf_grobal) \
	/etc/webalizer.conf \
	/etc/sysconfig/webalizer \
	/etc/cron.d/tv.tab

ln: $(ln_target)
ln_rm:
	sudo rm -f $(ln_target)

#ln: $(httpd_conf_grobal) /etc/webalizer.conf \
#	/etc/sysconfig/webalizer /etc/cron.d/tv.tab
#	/etc/sysconfig/webalizer /etc/cron.daily/webalizer
	

/etc/webalizer.conf: $(webalizer_dir)/webalizer.conf
	sudo ln -s $(abspath $<) $@

/etc/sysconfig/webalizer: $(abs_prefix)/etc/sysconfig/webalizer
	sudo ln -s $(abspath $<) $@

/etc/cron.d/tv.tab: $(abs_prefix)/etc/cron.tab
	sudo ln -s $(abspath $<) $@

$(httpd_conf_grobal): $(httpd_conf_local)
	sudo ln -s $(abspath $<) $@
#	sudo ln -s $(abspath $(httpd_conf_local)) $(httpd_conf_grobal)

INFO_JS		:= $(wildcard $(check_dir)/info-*/*.js)
INFO_JSON	:= $(INFO_JS:.js=.json)

json: $(INFO_JSON)




