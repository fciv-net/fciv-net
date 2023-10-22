<%@ page import="static org.apache.commons.lang3.StringUtils.stripToNull" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.io.IOException" %>
<%
    String gaTrackingId = null;
    String trackJsToken = null;
    try {
        Properties prop = new Properties();
        prop.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
        gaTrackingId = stripToNull(prop.getProperty("ga-tracking-id"));
        trackJsToken = stripToNull(prop.getProperty("trackjs-token"));
    } catch (IOException e) {
        e.printStackTrace();
    }
%>
<title>Freeciv3D - Fciv.net 3D</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="author" content="The FCIV.NET project">
<meta name="description" content="Play Fciv.net online with 3D WebGL in the browser.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:image" content="/static/images/brand.png" />

<script type="text/javascript" src="/javascript/libs/jquery.min.js"></script>
<script src="/static/javascript/bootstrap.min.js" ></script>
<link href="/static/images/favicon.png" rel="shortcut icon">
<link href="/static/images/apple-touch-icon.png" rel="apple-touch-icon">
<link href="/static/css/bootstrap.min.css" rel="stylesheet">
<link href="/static/css/bootstrap-theme.min.css" rel="stylesheet">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great|Open+Sans:400,400i,700,700i" rel="stylesheet">

<link rel="manifest" href="/static/manifest.json">

<style>
	/*
		 _____                   _                        _     
		|  ___| __ ___  ___  ___(_)_   __   __      _____| |__  
		| |_ | '__/ _ \/ _ \/ __| \ \ / /___\ \ /\ / / _ \ '_ \ 
		|  _|| | |  __/  __/ (__| |\ V /_____\ V  V /  __/ |_) |
		|_|  |_|  \___|\___|\___|_| \_/       \_/\_/ \___|_.__/ 

		The following styles apply to the whole frontend HTML.

	 */
	body {
		background-image: url("/static/images/background-pattern.jpg");
		padding-top: 60px;
		padding-bottom: 20px;
		color: #494A49;
	}
	h1, h2, h3, h4, h5, h6 {
		color: #BE602D;
	}
	h1, h2, h3 {
		font-family: 'Fredericka the Great', cursive;
		border-bottom: 1px solid #D3B86F;
	}
	/* 
	 * Delimits an area where to put content.
	 */
	.panel-freeciv {
		background-color: rgba(243, 236, 209, 0.5);                
		border-bottom: 1px solid #D3B86F;
		border-radius: 3px;
		margin-top: 1%;
		padding: 1%;
	}
	.panel-freeciv h1, .panel-freeciv h2, .panel-freeciv h3, 
	.panel-freeciv h4, .panel-freeciv h5, .panel-freeciv h6 {
		margin-top: 0px;
	}
	/*
	 * Jumbotron background is made transparent and its contents
	 * are centered.
	 */
	.jumbotron {
		background: rgba(0,0,0,0.1);
		text-align: center;
	}
	.jumbotron img {
		display: block;
		margin: auto;
	}
	/*
	 * Sometimes we need some additional space between rows.
	 */
	.top-buffer-3 { margin-top: 3%; }
	.top-buffer-2 { margin-top: 2%; }
	.top-buffer-1 { margin-top: 1%; }
	/*
	 * The bootstrap theme we use adds some transparency, this ensure it is removed.
	 */
	.navbar-inverse {
		background-image: none;
	}
	/*
	 * Ensure that the logo fits within the navbar.
	 */
	.navbar-brand {
		float: left;
		height: 50px;
		padding: 4px 15px;
		font-size: 18px;
		line-height: 20px;
	}
	.ongoing-games-number {
		margin-left: 5px;
		background:#BE602D;
	}
	.nav {
		font-size: 16px;
	}
    @media (min-width: 1024px) {
	  .container {
	    width: 1350px;
	  }
	}
</style>

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9958178836739125"
     crossorigin="anonymous"></script>
