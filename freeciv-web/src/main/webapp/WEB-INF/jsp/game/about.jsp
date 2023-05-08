<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<%@ include file="/WEB-INF/jsp/fragments/i18n.jsp" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<%@include file="/WEB-INF/jsp/fragments/head.jsp"%>
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
		font-family: 'Open Sans', Helvetica;
	}
	#game-launcher .game-type {
		width: 100%;
		background: #fcf1e0;
		display: inline-table;
		top: 0;
	}
	#game-launcher .game-type:not(:last-child) { margin-right: 40px; }
	#game-launcher .header {
		color: #000000;
		font-family: 'Fredericka the Great', cursive;
		padding: 15px;
		margin-bottom: 0px;
		background-image: -webkit-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
		background-image: -o-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
		background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #fcf8e3), to(#f8efc0));
		background-image: linear-gradient(to bottom, #fcf8e3 0, #f8efc0 100%);
		background-repeat: repeat-x;
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fffcf8e3', endColorstr='#fff8efc0', GradientType=0);
		background-color: #fcf8e3;
		border: 1px solid transparent;
		border-radius: 4px 4px 0 0;
		border-bottom: 0;
		border-color: #f5e79e;
	}
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
			<div class="container-fluid">
				<div class="row top-buffer-3">
					<p class="lead">
						<fmt:message key="index-lead"/>
					</p>
				</div>
			</div>
		</div> <!-- end jumbotron -->

		<div id="game-launcher" class="row">

				<div class="col-md-6">
					<div class="game-type">
						<div class="header">
							<span class="name"><i class="fa fa-user"></i> <fmt:message key="index-game-launcher-singleplayer" /></span>
						</div>

						<c:if test="${default_lang}">
							<div class="features">
								Play against the Freeciv AI with 3D WebGL<br>graphics using the Three.js 3D engine
							</div>
						</c:if>
						<a href="/webclient/?action=new&type=singleplayer" class="btn" id="webgl_button"><i class="fa fa-cube"></i> New Game</a>

					</div>
				</div>
				<div class="col-md-6">
					<div class="game-type">
						<div class="header">
							<span class="name"><i class="fa fa-users"></i> <fmt:message key="index-game-launcher-multiplayer"/></span>
						</div>
						<c:if test="${default_lang}">
							<div class="features">
								Start or join a game with multiple human or AI players.
							</div>
						</c:if>
						<a href="/game/list?v=multiplayer" class="btn"><i class="fa fa-users"></i> <fmt:message key="index-game-launcher-multiplayer"/></a>

					</div>
				</div>
		</div> <!-- end game launcher -->


		<div class="jumbotron">
			<h2>Game of the day</h2>

			<div class="row">
				<img src="/data/game_of_the_day.png" alt="" style="width: 99%;">

			</div>

		</div> <!-- end jumbotron -->

		<c:if test="${default_lang}">
			<div id="statistics" class="row">
				<div class="col-md-12">
					<div class="panel-freeciv statistics">
						<h4><span id="statistics-singleplayer"><b>0</b></span> <fmt:message key="index-stats-singleplayer"/> <span id="statistics-multiplayer"><b>0</b></span> <fmt:message key="index-stats-multiplayer"/><br>
						<fmt:message key="index-stats-since"/></h4>

					</div>
				</div>
			</div> <!-- end statistics -->
		</c:if>


	    <div class="row">
			<div class="col-md-6">
				<div class="panel-freeciv">
					<h3>Multiplayer:</h3>
					<c:if test="${not empty games and fn:length(games) > 0}">
						<table class="table multiplayer-games">
							<thead>
								<tr>
									<th>Game name</th>
									<th>State</th>
									<th>Turn</th>
									<th>Players</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach items="${games}" var="game">
									<tr class="${game.players > 0 && state == 'Pregame' ? 'highlight' : ''}">
										<td>
										    <b>
											  ${fn:replace(game.message, 'LongTurn', ' One Turn per Day ')}
											</b>
										</td>
										<td>
											${game.state}
										</td>
										<td>
											${game.turn}
										</td>
										<td>
											<c:choose>
												<c:when test="${game.players == 0}">
													None
												</c:when>
												<c:when test="${game.players == 1}">
													1 player
												</c:when>
												<c:otherwise>
													${game.players} players
												</c:otherwise>
											</c:choose>
										</td>			
										<td>
											<c:choose>
												<c:when test="${game.state == 'Running' or game.state == 'Pregame'}">
													<a  class="label label-success" href="/webclient/?action=multi&renderer=webgl&civserverport=${game.port}&amp;civserverhost=${game.host}&amp;multi=true&amp;type=${game.type}">
														Play
													</a>
												</c:when>
												<c:otherwise>
													<a class="label label-success" href="/webclient/?action=observe&amp;civserverport=${game.port}&amp;civserverhost=${game.host}&amp;multi=true&amp;type=${game.type}">
														Observe
													</a>
												</c:otherwise>
											</c:choose>
											<a class="label label-primary" href="/game/details?host=${game.host}&amp;port=${game.port}">
												Info
											</a>
										</td>
									</tr>
								</c:forEach>		
							</tbody>
						</table>
					</c:if>
					<c:if test="${empty games or fn:length(games) == 0}">
						No servers currently listed.
					</c:if>
				</div>
			</div>

                    <div class="col-md-6">
		                  <div class="vcontainer">
                                        <iframe  src="https://www.youtube.com/embed/qLJkVJ-qVQI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="video"></iframe>
                                        </div>
                                  </div>
			
		    </div>


		<c:if test="${default_lang}">
			<div class="row">
				<div class="col-md-12">
					<h2><fmt:message key="index-developers"/></h2>
				</div>
			</div> 
			<div class="row">
				<div class="col-md-4">
					<div class="panel-freeciv">
						<h4><fmt:message key="index-contributing"/></h4>
						Freeciv is open source software released under the GNU General Public License.
						<a href="https://github.com/fciv-net/fciv-net"><fmt:message key="index-developers"/></a> are welcome to join development.
					</div>
				</div>
				<div class="col-md-4">
					<div class="panel-freeciv">
						<h4><fmt:message key="index-stack"/></h4>
						<img class="small" src="/static/images/webgl-stack.png">WebGL
						<img class="small" src="/static/images/html5-stack.png">HTML5<br>
						<img class="small" src="/static/images/tomcat-stack.png">Tomcat
						<img class="small" src="/static/images/python-stack.png">Python<br>
						<img class="small" src="/static/images/three-stack.png">Three.js
						<img class="small" src="/static/images/blender-stack.png">Blender
					</div>
				</div>
				<div class="col-md-4">			
  			              <iframe src="https://discord.com/widget?id=960605237775855676&theme=dark" width="380" height="300" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
				</div>
			</div> <!-- end developers -->
		</c:if>


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
