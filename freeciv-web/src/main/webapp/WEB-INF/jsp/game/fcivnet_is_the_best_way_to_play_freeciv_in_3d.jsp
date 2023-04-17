<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/fragments/i18n.jsp" %>
<!DOCTYPE html>
<html lang="en">
<head>
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
<title>FCIV.NET is the best way to play Freeciv in 3D </title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="author" content="The FCIV.NET project">
<meta name="description" content="Play Fciv.net online with 3D WebGL in the browser.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:image" content="/static/images/brand.png" />

<script type="text/javascript" src="/javascript/libs/jquery.min.js"></script>
<link href="/static/images/favicon.png" rel="shortcut icon">
<link href="/static/images/apple-touch-icon.png" rel="apple-touch-icon">
<link href="/static/css/bootstrap.min.css" rel="stylesheet">
<link href="/static/css/bootstrap-theme.min.css" rel="stylesheet">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great|Open+Sans:400,400i,700,700i" rel="stylesheet">

<link rel="manifest" href="/static/manifest.json">

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-35GD0T4L9J"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-35GD0T4L9J');
</script>



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
		color: black;
	}
	h1, h2, h3 {
		border-bottom: 1px solid #D3B86F;
				font-family:  'Open Sans',sans-serif;
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
		text-align: left;
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
</style>

	<script src="/javascript/libs/Detector.js"></script>
	<script src="/static/javascript/index.min.js"></script>
	<style>
	/* Make sure that the development tools used in freeciv are not to big */
	img.small {
		max-height: 40px;
	}
	/* 2D/3D teasers must remain within their container. */
	img.teaser {
		display: block;
		margin: auto;
		width: 100%;
	}
	.statistics { text-align: center; }

	/* Game launcher */
	#game-launcher {
		width: 100%;
		margin: 0 auto;

	}
	#game-launcher .game-type {
		width: 100%;
		background: #fcf1e0;
		display: inline-table;
		top: 0;
	}
	#game-launcher .game-type:not(:last-child) { margin-right: 40px; }

	#game-launcher .name {
		width: 100%;
		font-size: 2em;
		display: block;
		text-align: center;
		padding: 2px 0 2px;
	}
	#game-launcher .features {
		list-style: none;
		text-align: center;
		margin: 0;
		padding: 10px 0 0 0;
		font-size: 0.9em;
	}
	#game-launcher .btn {
		display: inline-block;
		color: rgb(255, 255, 255);
		border: 0;
		border-radius: 5px;
		padding: 10px;
		width: 230px;
		display: block;
		font-weight: 700;
		font-size: 20px;
		text-transform: uppercase;
		margin: 20px auto 10px;
		background: #be2d2d;
   text-shadow:
    -0.5px -0.5px 0 #000,
    0.5px -0.5px 0 #000,
    -0.5px 0.5px 0 #000,
    0.5px 0.5px 0 #000;
	}
	#game-launcher a.small { width: 130px;	}
	.multiplayer-games th:last-child { width: 100px; }
	.multiplayer-games a.label:last-child { margin-left: 3px; }
	.multiplayer-games .highlight {
		color: green;
		font-weight: bold;
	}

	.videoWrapper {
	position: relative;
	padding-bottom: 56.25%; /* 16:9 */
	padding-top: 25px;
	height: 0;
    }

	.videoWrapper iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	}
	.jumbotron {
	padding-bottom: 0px;
	}

  .vcontainer {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
  }
  .video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

</style>
</head>
<body>
	<div class="container">
		<%@include file="/WEB-INF/jsp/fragments/header.jsp"%>

		<div class="jumbotron">
			<div class="row">

				<img src="/static/images/freeciv-webgl-splash-48.png" alt="" style="width: 95%;">

			</div>

			 <h2>FCIV.NET is the best way to play Freeciv in 3D</h2>



			<div class="container-fluid">
				<div class="row top-buffer-3">
					<p class="lead" style="color: black;">

                      FCIV.NET allows you to play Freeciv in 3D for free online in your browser. I will now explain why FCIV.NET can be the perfect free strategy game.
                      </p>

                      <p style="color: black;">
                      FCIV.NET is a fork of <a href="https://www.freeciv.org">Freeciv</a> based on Freeciv-web, and uses the 3D engine
                      <a href="https://threejs.org/">Three.js</a>. The source code is available on <a href="https://github.com/fciv-net/fciv-net">Github</a>
                      with a AGPL open source license. The AGPL license guarantees that Freeciv will always be free and open source.
					  <p style="color: black;">
                        FCIV.NET is the perfect strategy game because it allows anyone to play Freeciv in 3D in the browser.
                        In many ways Freeciv is a classic abstract strategy game like Chess. Yet Freeciv has more complex rules than Chess,
                        which means that human players can play and compete in a game with is not yet fully solved by brute-force artificial intelligence computer algorithms.
                        So Freeciv is a classic strategy game up there with Chess, Reversi, Backgammon, Risk and of course the Civilization series.

                      </p>
                       <p style="color: black;">
                        FCIV.NET has pretty 3D graphics, nice 3D models made in Blender, and there is a 3D artist working on improving the 3D models.
                        So this will be a beautiful game, even though making a beautiful 3D game takes a lot of creativity, labour and effort.

                      </p>
                      <p style="color: black;">
                        FCIV.NET is educational! Many teachers use Freeciv in schools to teach about the history of civilizations, technological developments,
                        history, geopolitics, geography. The game features in-game articles from Wikipedia describing each technology, unit and city improvement.

                      </p>
                      <p style="color: black;">
                        FCIV.NET is most importantly a lot of fun. The game can be played in single-player or multi-player mode, on a desktop computer, laptop or mobile
                        phone which supports HTML5 and WebGL. Some users still have technical issues with WebGL 2, which we are hopeful will be soved by time.
                      </p>
	                 <p style="color: black;">

                      <a style="color: black;" href="https://www.fciv.net/">Play FCIV.NET here!</a>
                    </p>

				</div>
			</div>
		</div> <!-- end jumbotron -->







			<div class="row">
				<div class="col-md-12">
				<br><br>
						<center>
                           <a class="twitter-timeline" data-width="600" data-height="600" href="https://twitter.com/fcivnet?ref_src=twsrc%5Etfw">Tweets by fcivnet</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                        </center>
				</div>
			</div>

		<%@include file="/WEB-INF/jsp/fragments/footer.jsp"%>
	</div>
</body>
</html>
