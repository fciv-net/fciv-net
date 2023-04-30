<nav class="navbar navbar-inverse navbar-fixed-top">
	<div class="container">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
		<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
			<span class="sr-only"><fmt:message key="nav-toggle-navigation"/></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>
		<a class="navbar-brand" href="/">
			<!--Logo font is: Liberation Sans Bold Italic -->
			<img src="/static/images/brand.png" alt="Freeciv-web">
		</a>
		</div>

		<!-- Collect the nav links, forms, and other panel-freeciv for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		<ul class="nav navbar-nav">
			<li><a href="/webclient/?action=new&renderer=webgl&type=singleplayer">New Game</a></li>
			<li class="dropdown">
				<a href="/game/list?v=singleplayer" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
					<span onclick="window.location='/game/list?v=singleplayer'">Online Games</span> <span class="caret"></span> <span class="badge ongoing-games-number" id="ongoing-games" title="Ongoing games"></span>
				</a>
				<ul class="dropdown-menu">
					<li><a href="/game/list?v=singleplayer">Single-player</a></li>
					<li role="separator" class="divider"></li>
					<li><a href="/game/list?v=multiplayer">Multiplayer</a></li>
				
				</ul>
			</li>
			<li><a href="https://github.com/fciv-net/fciv-net">GitHub</a></li>

			<li><a href="https://discord.gg/baFdjpNpTR">Discord</a></li>

		    <li><a href="https://www.fciv.net/wiki/">Wiki</a></li>

		    <li><a href="/hall_of_fame">Hall of Fame</a></li>

		    <li><a href="/about">About</a></li>

            <li><a href="https://www.twitter.com/fcivnet">@Fcivnet</a></li>
		
</ul>
		<form class="navbar-form navbar-right hidden-sm hidden-md" action="https://duckduckgo.com/" style="width: 220px;">
			<input type="hidden" name="sites" value="www.freeciv.org,forum.freeciv.org,freeciv.wikia.com,www.fciv.net">
			<div class="form-group">
				<div class="input-group">
					<input type="text" class="form-control" name="q" placeholder="Search Fciv...">
					<span class="input-group-btn">
						<button class="btn btn-default" type="submit"><i class="fa fa-search"></i></button>
					</span>
				</div>
			</div>
		</form>
		</div><!-- end navbar-collapse -->
	</div><!-- end container-fluid -->
</nav> <!-- end nav -->
<script src="/static/javascript/header.js"></script>

