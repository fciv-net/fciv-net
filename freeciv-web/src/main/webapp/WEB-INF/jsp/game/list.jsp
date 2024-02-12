<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ include file="/WEB-INF/jsp/fragments/i18n.jsp"%>
<!DOCTYPE html>
<html lang="en">
<head>
<%@include file="/WEB-INF/jsp/fragments/head.jsp"%>

<style>
	.nav-tabs {
		margin-top: 5px;
	}
	.nav>li>a:hover {
		background-color: #796f6f
	}
	.nav-tabs>li>a {
		background-color: #ecb66a;
		text-transform: uppercase;
		color: #fff;
	    font-weight: 700;		
	}
	.nav-tabs>li.active>a {
		color: #fff;
	}
	.nav-tabs>li.active>a, .nav-tabs>li.active>a:hover, .nav-tabs>li.active>a:focus {
	    background-color: #be602d;
	    color: #fff;
	}
	.tab-pane {
		background-color: #fcf1e0;
	}
	.table {
		background-color: #fcf1e0;
	}
	.table td {
		vertical-align: middle;
	}
	.label-lg {
		font-size: 13px;
	}
	.label-lg:not(:last-child) {
		margin-right: 3px;
	}
	.private-game {
		font-style: italics;
	}
	.running-game {
		font-weight: bold;
	}
	.highlight {
		color: green;
		font-weight: bold;
	}
	.active-player {
		font-weight: bold;
	}
	#multiplayer-table td:last-child {
		width: 290px;
	}
	#singleplayer-table td:last-child {
		width: 140px;
	}
</style>
	
	
</head>
<body>
	<%@include file="/WEB-INF/jsp/fragments/header.jsp" %>
	
	<!-- Begin page content -->
	<div id="content" class="container">
		<div>
			<ul class="nav nav-tabs hidden-xs" role="tablist">
				<li role="presentation" class="${view == 'singleplayer' or empty view ? 'active' : ''}"><a href="#single-player-tab"
					aria-controls="single-player" role="tab" data-toggle="tab">Single-player (${singlePlayerGames})</a></li>
				<li role="presentation" class="${view == 'multiplayer' ? 'active' : ''}"><a href="#multi-player-tab"
					aria-controls="multi-player" role="tab" data-toggle="tab">Multiplayer (${multiPlayerGames})</a></li>
			</ul>
			<ul class="nav nav-tabs hidden-lg hidden-md hidden-sm" role="tablist">
				<li role="presentation" class="${view == 'singleplayer' or empty view ? 'active' : ''}"><a href="#single-player-tab"
					aria-controls="single-player" role="tab" data-toggle="tab">Single (${singlePlayerGames})</a></li>
				<li role="presentation" class="${view == 'multiplayer' ? 'active' : ''}"><a href="#multi-player-tab"
					aria-controls="multi-player" role="tab" data-toggle="tab">Multi (${multiPlayerGames})</a></li>
			</ul>

			<div class="tab-content">
				<div role="tabpanel" class="tab-pane ${view == 'singleplayer' or empty view ? 'active' : ''}" id="single-player-tab">
					<c:if test="${fn:length(singlePlayerGameList) > 0}">
						<table id="singleplayer-table" class="table">
							<tr>
								<th>Flag</th>
								<th>Player</th>
								<th class="hidden-xs">Game details</th>
								<th class="hidden-xs">Players</th>
								<th class="hidden-xs">Turn</th>
								<th>Action</th>
							</tr>
							<c:forEach items="${singlePlayerGameList}" var="game">
								<tr class="${game.isProtected() ? '.private-game' : '' }">
									<td>
										<c:if test="${game.flag ne 'none'}">
											<img src="/images/flags/${game.flag}.svg" alt="${game.flag}" width="80" height="50" title="${game.turn}">
										</c:if>
									</td>
									<td><b>${game.player}</b></td>
									<td class="hidden-xs">${game.message}</td>
									<td class="hidden-xs">${game.players}</td>
									<td class="hidden-xs">${game.turn}</td>
									<td>
										<a class="label label-primary label-lg" href="/game/details?host=${game.host}&amp;port=${game.port}">
											Info
										</a>
									</td>
								</tr>
							</c:forEach>
						</table>
					</c:if>
					<c:if test="${fn:length(singlePlayerGameList) == 0}">

					<div style="padding: 30px; font-size:200%;">
							<a class="label label-primary"  href="/webclient/?action=new&amp;type=singleplayer">Start</a> a new single player game!
					</div>
					</c:if>
				</div>
	
				<div role="tabpanel" class="tab-pane ${view == 'multiplayer' ? 'active' : ''}" id="multi-player-tab">
					<c:if test="${fn:length(multiPlayerGamesList) > 0}">
						<table id="multiplayer-table" class="table">
							<tr>
								<th class="hidden-xs">Players</th>
								<th>Message</th>
								<th>State</th>
								<th class="hidden-xs">Turn</th>
								<th>Action</th>
							</tr>
							<c:forEach items="${multiPlayerGamesList}" var="game">
								<tr
									class="${game.isProtected() ? 'private-game' : (game.state eq 'Running' ? 'running-game' : (game.players gt 0 ? 'highlight' : ''))}">
									<td class="hidden-xs">
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
									<td>${game.message}</td>
									<td>${game.state}</td>
									<td class="hidden-xs">${game.turn}</td>
									<td><c:choose>
											<c:when test="${game.state != 'Running'}">

                                                <a class="label label-success label-lg"
                                                    href="/webclient/?action=multi&amp;renderer=webgl&amp;civserverport=${game.port}&amp;civserverhost=${game.host}&amp;multi=true&amp;type=${game.type}">
                                                    Play 3D</a>
											</c:when>
											<c:otherwise>
                                                <a class="label label-success label-lg"
                                                    href="/webclient/?action=multi&amp;renderer=webgl&amp;civserverport=${game.port}&amp;civserverhost=${game.host}&amp;multi=true&amp;type=${game.type}">
                                                    Play 3D</a>
											<c:if test="${game.type} ne 'longturn'}">
												<a class="label label-success label-lg"
													href="/webclient/?action=observe&amp;civserverport=${game.port}&amp;civserverhost=${game.host}&amp;multi=true&amp;type=${game.type}">
													Observe</a>
											</c:if>
											</c:otherwise>
										</c:choose>
										<a class="label label-primary label-lg"	href="/game/details?host=${game.host}&amp;port=${game.port}">
											Info
										</a>
									</td>
								</tr>
							</c:forEach>
						</table>
					</c:if>
					<c:if test="${fn:length(multiPlayerGamesList) == 0}">
						No servers currently listed
					</c:if>
				</div>
			</div>
		</div>

		<%@include file="/WEB-INF/jsp/fragments/footer.jsp"%>
	</div>


<script>
$(document).ready(function(){
    // Function to show Single-player tab
    function showSinglePlayerTab() {
        // Remove active class from all tabs
        $("ul.nav-tabs li").removeClass("active");
        // Add active class to Single-player tab
        $("ul.nav-tabs li[role='presentation'] a[href='#single-player-tab']").parent().addClass("active");

        // Hide all tab panes
        $(".tab-content .tab-pane").removeClass("active");
        // Show Single-player tab pane
        $("#single-player-tab").addClass("active");
    }

    // Function to show Multiplayer tab
    function showMultiPlayerTab() {
        // Remove active class from all tabs
        $("ul.nav-tabs li").removeClass("active");
        // Add active class to Multiplayer tab
        $("ul.nav-tabs li[role='presentation'] a[href='#multi-player-tab']").parent().addClass("active");

        // Hide all tab panes
        $(".tab-content .tab-pane").removeClass("active");
        // Show Multiplayer tab pane
        $("#multi-player-tab").addClass("active");
    }

    // Check URL hash on page load
    if (window.location.hash === "#multi-player-tab") {
        showMultiPlayerTab();
    } else {
        showSinglePlayerTab();
    }

    // Click event handler for Single-player tab
    $("ul.nav-tabs li[role='presentation'] a[href='#single-player-tab']").click(function(){
        showSinglePlayerTab();
    });

    // Click event handler for Multiplayer tab
    $("ul.nav-tabs li[role='presentation'] a[href='#multi-player-tab']").click(function(){
        showMultiPlayerTab();
    });
});

</script>
</body>
</html>
