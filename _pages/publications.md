<!-- Nav Bar -->
<nav id="navbar" class="navbar navbar-light navbar-expand-sm {% if site.navbar_fixed %}fixed-top{% else %}sticky-top{% endif %}" role="navigation">
  <div class="container">
    <!-- Social Icons on the left (Tim's style) -->
    <div class="social-icons-header">
      {% if site.scholar_userid %}
      <a href="https://scholar.google.com/citations?user={{ site.scholar_userid }}" target="_blank" title="Google Scholar">
        <i class="ai ai-google-scholar"></i>
      </a>
      {% endif %}
      
      {% if site.linkedin_username %}
      <a href="https://www.linkedin.com/in/{{ site.linkedin_username }}" target="_blank" title="LinkedIn">
        <i class="fab fa-linkedin"></i>
      </a>
      {% endif %}
      
      <a href="mailto:{{ site.email }}" title="Email">
        <i class="fas fa-envelope"></i>
      </a>
      
      {% if site.github_username %}
      <a href="https://github.com/{{ site.github_username }}" target="_blank" title="GitHub">
        <i class="fab fa-github"></i>
      </a>
      {% endif %}
      
      {% if site.x_username %}
      <a href="https://twitter.com/{{ site.x_username }}" target="_blank" title="X">
        <i class="fab fa-x-twitter"></i>
      </a>
      {% endif %}
      
      {% if site.bluesky_username %}
      <a href="https://bsky.app/profile/{{ site.bluesky_username }}" target="_blank" title="Bluesky">
        <i class="fas fa-butterfly"></i>
      </a>
      {% endif %}
    </div>

    <!-- Navbar Toggle -->
    <button class="navbar-toggler collapsed ml-auto" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar top-bar"></span>
      <span class="icon-bar middle-bar"></span>
      <span class="icon-bar bottom-bar"></span>
    </button>

    <div class="collapse navbar-collapse text-right" id="navbarNav">
      <ul class="navbar-nav ml-auto flex-nowrap">
        <!-- About -->
        <li class="nav-item {% if page.permalink == '/' %}active{% endif %}">
          <a class="nav-link" href="{{ '/' | relative_url }}">about</a>
        </li>
        
        <!-- Publications -->
        <li class="nav-item {% if page.url contains 'publications' %}active{% endif %}">
          <a class="nav-link" href="{{ '/publications/' | relative_url }}">publications</a>
        </li>

        <!-- Theme toggle -->
        {% if site.enable_darkmode %}
        <li class="toggle-container">
          <button id="light-toggle" title="Change theme">
            <i class="ti ti-sun" id="light-toggle-system"></i>
            <i class="ti ti-moon" id="light-toggle-dark"></i>
            <i class="ti ti-brightness-2" id="light-toggle-light"></i>
          </button>
        </li>
        {% endif %}
      </ul>
    </div>
  </div>
</nav>