<%@ page import="java.util.Properties" %>
<%@ page import="java.io.IOException" %>
<%@ page import="static org.apache.commons.lang3.StringUtils.stripToNull" %>
<%@ page import="static org.apache.commons.lang3.StringUtils.stripToEmpty" %>
<%@ page import="static java.lang.Boolean.parseBoolean" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
String gaTrackingId = null;
String googleSigninClientKey = null;
String captchaKey = null;
boolean fcwDebug = false;
boolean webgpu = false;
boolean app = false;
try {
  Properties prop = new Properties();
  prop.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
  gaTrackingId = stripToNull(prop.getProperty("ga-tracking-id"));
  googleSigninClientKey = stripToEmpty(prop.getProperty("google-signin-client-key"));
  captchaKey = stripToEmpty(prop.getProperty("captcha_public"));

  String debugParam = request.getParameter("debug");
  fcwDebug = (debugParam != null && (debugParam.isEmpty() || parseBoolean(debugParam)));

  String webgpuParam = request.getParameter("webgpu");
  webgpu = (webgpuParam != null && (!webgpuParam.isEmpty() || parseBoolean(webgpuParam)));

  String appParam = request.getParameter("app");
  app = (appParam != null && (appParam.isEmpty() || parseBoolean(appParam)));

} catch (IOException e) {
  e.printStackTrace();
}
%>
<!DOCTYPE html>
<html>
<head>
<title>Freeciv 3D - FCIV.NET 3D browser version of the turn-based strategy game Freeciv.</title>

<link href="/static/css/bootstrap.min.css" rel="stylesheet">

<link rel="stylesheet" href="/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="/css/webclient.min.css?ts=${initParam.buildTimeStamp}" />
<meta name="description" content="Fciv.net - play Freeciv in 3D online for free; open source strategy game">
<meta property="og:image" content="https://fciv.net/static/images/freeciv-webgl-splash-48.png" />

<script type="text/javascript">
var ts="${initParam.buildTimeStamp}";
var fcwDebug=<%= fcwDebug %>;
var webgpu = <%= webgpu %>;
</script>
<script type="text/javascript" src="/javascript/libs/jquery.min.js?ts=${initParam.buildTimeStamp}"></script>

<script src="https://apis.google.com/js/platform.js"></script>

<script type="text/javascript" src="/javascript/libs/stacktrace.min.js"></script>

<script async src="https://ga.jspm.io/npm:es-module-shims@1.7.1/dist/es-module-shims.js"></script>

<% if (!webgpu) { %>
  <script type="importmap">
        {
                "imports": {
                        "three": "/javascript/webgl/libs/three.module.min.js?ts=${initParam.buildTimeStamp}"
                }
        }
  </script>
<% } else { %>
  <script type="importmap">
        {
                "imports": {
                        "three": "/javascript/webgpu/libs/three-webgpu.module.min.js?ts=${initParam.buildTimeStamp}"
                }
        }
  </script>
<% } %>
<script type="module">
  import * as THREE from 'three';
  window.THREE = THREE;

<% if (webgpu) { %>
  import { WebGPURenderer } from '/javascript/webgpu/libs/webgpu-renderer.module.min.js?ts=${initParam.buildTimeStamp}';
  window.WebGPURenderer = WebGPURenderer;
<% } %>

  import { GLTFLoader } from '/javascript/webgl/libs/GLTFLoader.js?ts=${initParam.buildTimeStamp}';
  window.GLTFLoader = GLTFLoader;

  import { OrbitControls } from '/javascript/webgl/libs/OrbitControls.js?ts=${initParam.buildTimeStamp}';
  window.OrbitControls = OrbitControls;

<% if (!webgpu) { %>

  import { AnaglyphEffect } from '/javascript/webgl/effects/AnaglyphEffect.js?ts=${initParam.buildTimeStamp}';
  window.AnaglyphEffect = AnaglyphEffect;

  import { Water } from '/javascript/webgl/libs/Water2.js?ts=${initParam.buildTimeStamp}';
  window.Water = Water;
<% } %>

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

<script>var captcha_site_key = '<%= captchaKey %>';</script>
<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
    async defer>
</script>

<style>
	/*
		FCIV.NET - Freeciv 3D.
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

<% if (!app) { %>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9958178836739125"
     crossorigin="anonymous"></script>
<% } %>
</head>

<body>

  <div id="introtxtja">FCIV.NET is the 3D version of the strategy game Freeciv. Because Civilization should be free!</div>

    <div class="container">
        <%@include file="/WEB-INF/jsp/fragments/header.jsp"%>

            <% if (!app) { %>
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
            <% } %>

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
