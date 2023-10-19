<%@ page import="java.util.Properties" %>
<%@ page import="java.io.IOException" %>
<%@ page import="static org.apache.commons.lang3.StringUtils.stripToNull" %>
<%@ page import="static org.apache.commons.lang3.StringUtils.stripToEmpty" %>
<%@ page import="static java.lang.Boolean.parseBoolean" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
String gaTrackingId = null;
String googleSigninClientKey = null;
String trackJsToken = null;
String captchaKey = null;
boolean fcwDebug = false;
try {
  Properties prop = new Properties();
  prop.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
  gaTrackingId = stripToNull(prop.getProperty("ga-tracking-id"));
  googleSigninClientKey = stripToEmpty(prop.getProperty("google-signin-client-key"));
  trackJsToken = stripToNull(prop.getProperty("trackjs-token"));
  captchaKey = stripToEmpty(prop.getProperty("captcha_public"));

  String debugParam = request.getParameter("debug");
  fcwDebug = (debugParam != null && (debugParam.isEmpty() || parseBoolean(debugParam)));
} catch (IOException e) {
  e.printStackTrace();
}
%>
<!DOCTYPE html>
<html>
<head>
<title>FCIV.NET 3D browser version of the turn-based strategy game Freeciv.</title>

<link href="/static/css/bootstrap.min.css" rel="stylesheet">

<link rel="stylesheet" href="/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="/css/webclient.min.css?ts=${initParam.buildTimeStamp}" />
<meta name="description" content="Fciv.net - play Freeciv in 3D online for free; open source strategy game">
<meta property="og:image" content="https://fciv.net/static/images/freeciv-webgl-splash-48.png" />

<script type="text/javascript">
var ts="${initParam.buildTimeStamp}";
var fcwDebug=<%= fcwDebug %>;
</script>
<script type="text/javascript" src="/javascript/libs/jquery.min.js?ts=${initParam.buildTimeStamp}"></script>

<script src="/static/javascript/bootstrap.min.js" ></script>

<script src="https://apis.google.com/js/platform.js"></script>

<script type="text/javascript" src="/javascript/libs/stacktrace.min.js"></script>

<script type="text/javascript" src="/javascript/libs/handlebars.runtime.js?ts=${initParam.buildTimeStamp}"></script>

<script async src="https://ga.jspm.io/npm:es-module-shims@1.7.1/dist/es-module-shims.js"></script>

<script type="importmap">
        {
                "imports": {
                        "three": "/javascript/webgl/libs/three.module.min.js?ts=${initParam.buildTimeStamp}"
                }
        }
</script>

<script type="module">
  import * as THREE from 'three';
  window.THREE = THREE;

  import { AnaglyphEffect } from '/javascript/webgl/libs/AnaglyphEffect.js?ts=${initParam.buildTimeStamp}';
  window.AnaglyphEffect = AnaglyphEffect;

  import { GLTFLoader } from '/javascript/webgl/libs/GLTFLoader.js?ts=${initParam.buildTimeStamp}';
  window.GLTFLoader = GLTFLoader;

  import { OrbitControls } from '/javascript/webgl/libs/OrbitControls.js?ts=${initParam.buildTimeStamp}';
  window.OrbitControls = OrbitControls;

  import { Water } from '/javascript/webgl/libs/Water2.js?ts=${initParam.buildTimeStamp}';
  window.Water = Water;

  import { DRACOLoader } from '/javascript/webgl/libs/DRACOLoader.js?ts=${initParam.buildTimeStamp}';
  window.DRACOLoader = DRACOLoader;

</script>


<script type="text/javascript" src="/javascript/webclient.min.js?ts=${initParam.buildTimeStamp}"></script>

<script type="text/javascript" src="/music/audio.min.js"></script>

<link rel="shortcut icon" href="/images/freeciv-shortcut-icon.png" />
<link rel="apple-touch-icon" href="/images/freeciv-splash2.png" />

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, minimal-ui" />
<meta name="mobile-web-app-capable" content="yes">

<meta name="google-signin-client_id" content="<%= googleSigninClientKey %>">
<link rel="manifest" href="/static/manifest.json">

<script>var captcha_site_key = '<%= captchaKey %>';</script>
<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
    async defer>
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
		padding-top: 60px;
		padding-bottom: 20px;
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

</head>

<body>

  <div id="introtxtja">FCIV.NET is the 3D version of the strategy game Freeciv. Because Civilization should be free!</div>

    <div class="container">
        <%@include file="/WEB-INF/jsp/fragments/header.jsp"%>

            <div class="row" style="position: relative; z-index: 1000; padding-top: 60px;  margin-left: -56px;">
                    <div class="col-md-3"></div>
                    <div class="col-md-9">

                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9958178836739125"
                         crossorigin="anonymous"></script>
                    <!-- HORIZONAL-GOOD-SIZE -->
                    <ins class="adsbygoogle"
                         style="display:inline-block;width:728px;height:90px"
                         data-ad-client="ca-pub-9958178836739125"
                         data-ad-slot="9479544084"></ins>
                    <script>
                         (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>

       </div>
    </div>



    </div>

    <jsp:include page="pregame.jsp" flush="false"/>
    <jsp:include page="game.jsp" flush="false"/>

</body>

<script id="terrain_fragment_shh" type="x-shader/x-fragment">
  <jsp:include page="/javascript/webgl/shaders/terrain_fragment_shader.glsl" flush="false"/>
</script>

<script id="terrain_vertex_shh" type="x-shader/x-vertex">
  <jsp:include page="/javascript/webgl/shaders/terrain_vertex_shader.glsl" flush="false"/>
</script>

</html>
