#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
# $Id: md2html.py 142 2014-02-19 11:16:06Z tommie $
#
# Usage: .py [options]
#
# Options:
#
#
import markdown2
import glob

import logging
from debug import FORMAT as debug_FORMAT, _debug, _info, _warn, _error, _ver as g_debug_ver
logging.basicConfig(format=debug_FORMAT, level=logging.INFO)	# ログレベル
#logging.basicConfig(format=debug_FORMAT, level=logging.DEBUG)	# ログレベル


#-------------------------------------------------------------------------------
#
# グローバル定数定義
#

g_ver = "$Id: md2html.py 142 2014-02-19 11:16:06Z tommie $"	# バージョン			
#
#-------------------------------------------------------------------------------
def main():
	markdown = open( "index.md", "r").read()
	html = markdown2.markdown(markdown, extras=["wiki-tables"])
	template = open( "index.tpl", "r").read()
	outputHTML = template.format( 
		MarkDown=html	
	)
	outFile = open( "index.html", "w")
	outFile.write( outputHTML)
	outFile.close()
		
main()
	
	
	
#-------------------------------------------------------------------------------
#EOF
#-------------------------------------------------------------------------------

