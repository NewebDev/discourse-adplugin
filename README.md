# Neweb Advertising Plugin

**Authors**:        [Julien Loisel](mailto:jloisel@neweb.com)  
**Version**:        1.0.0   
**Contributors**:   See credits section below   
**License**:        MIT License   
**Supported Discourse Version**: 1.8    
**Supported Ad Platforms**: 
* [Smart Adserver](http://smartadserver.com)


## Quick Start in 3 Steps

This quick start shows you how to install this plugin and use it.  Recommended if you have:

* A live discourse forum 
* You have deployed your live forum using Docker.  If you're using Digital Ocean, it's likely that your forum is deployed on Docker. 

For non-docker or local development installation (those with programming experience), see **Other Installation**.


### Step 1 - Install the Neweb Discourse Advertising Plugin


As seen in a [how-to on meta.discourse.org](https://meta.discourse.org/t/advanced-troubleshooting-with-docker/15927#Example:%20Install%20a%20plugin), simply **add the plugin's repository url to your container's app.yml file**:

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/NewebDev/neweb-adplugin.git
```
Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```

### Step 2 - Configure Your Settings to Display Your Advertisments

There 1 step for configuring your Discourse settings to enable advertisements to display in your Discourse forum.


### Step 3 - See Your Ad

Once you've configured your settings and your advertising platform has ads that are ready to serve, navigate to the page where you've inputted for the location and you should see ads.


## Plugin Features

In this section, we go into more detail on:
* Available Locations for Ad Display
* Trust Levels
* Languages Supported

### Available Locations for Ad Display

The following are available locations along with a description and an image showing their location within Discourse to display ads for all platforms.

Location Name | Description
--- | --- | ---
Topic List Top | Ad will appear at the header of Discourse homepage 
Topic Above Post Stream | Ad will appear in the header of all Discourse forum topics 
Topic Above Suggested | Ad will appear in the footer above suggested topics of all Discourse forum topics 
Post Bottom & Nth Post | Ad will appear on the stipulated nth post within a topic.  So if you have 5 posts in a topic and you want the ad to display after on the 2nd post, put 2 in ```smart_ad_server_nth_post_code```.  

### Trust Levels

You can use the ```smart_ad_server_through_trust_level``` dropdown to disable ads for users above a certain trust levels. As a guide, choosing:

* 0 shows ads to users that are not logged in.
* 1 shows ads to users that are not logged in, and to new and basic users.
* 2 shows ads to members as well, but not to regulars and leaders.
* 3 shows ads to everyone but leaders.
* 4 shows ads to everyone including leaders.

To find more about trust levels in Discourse, refer to [Discourse's posts on trust levels](https://meta.discourse.org/t/what-do-user-trust-levels-do/4924)

### Languages Supported

* English
* French

## Other Installation

There are two sets of installation instructions:

1. Non-Docker Installation - If you have experience with programming.  This will set up this plugin as a git submodule in your Discourse directory.
2. Local Development - If you want develop locally and have experience with programming.  This will set up this plugin as a symlinked file in Discourse's plugin directory.

If you already have a live Discourse forum up, please go to the Quick Start heading above.


### Non-docker installation


* Run `bundle exec rake plugin:install repo=https://github.com/NewebDev/neweb-adplugin.git` in your discourse directory
* In development mode, run `bundle exec rake assets:clean`
* In production, recompile your assets: `bundle exec rake assets:precompile`
* Restart Discourse
 




