import {withPluginApi} from 'discourse/lib/plugin-api';
import PageTracker from 'discourse/lib/page-tracker';
import loadScript from 'discourse/lib/load-script';

let _loaded = false,
    _sas_loaded = false,
    _promise = null,
    _formatIdsArr = [],
    currentUser = Discourse.User.current(),
    network_id = Discourse.SiteSettings.smart_ad_server_network_id,
    siteId = '',
    pageId = '',
    refreshTimeout = null;

let smartAdInitSrc = (('https:' === document.location.protocol) ? 'https:' : 'http:') + '//ced.sascdn.com/tag/'+network_id+'/smart.js',
    smartadSrc = (('https:' === document.location.protocol) ? 'https:' : 'http:') + '//www3.smartadserver.com';

const mobileView = Discourse.Site.currentProp('mobileView');

function loadSmartad() {
    if (_loaded) {
        return Ember.RSVP.resolve();
    }

    if (_promise) {
        return _promise;
    }

    _promise = loadScript(smartAdInitSrc, {scriptTag: true}).then(function () {
        _loaded = true;
    });

    return _promise;
}

function initSas() {
    sas.cmd.push(function() {
        sas.setup({ networkid: network_id, domain: smartadSrc, async: true });
    });

    if (!mobileView) {
        siteId = Discourse.SiteSettings.smart_ad_server_site_id;
        pageId = Discourse.SiteSettings.smart_ad_server_page_id;
    } else {
        siteId = Discourse.SiteSettings.smart_ad_server_mobile_site_id;
        pageId = Discourse.SiteSettings.smart_ad_server_mobile_page_id;
    }

    sas.cmd.push(function() {
        sas.call("onecall", {
            siteId: siteId,
            pageId: pageId,
            formatId: _formatIdsArr.join(),
            target: ''
        });
    });
}

function initFormatIds() {

    if (Discourse.SiteSettings.smart_ad_server_topic_list_top_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_topic_list_top_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_topic_above_post_stream_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_topic_above_post_stream_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_topic_above_suggested_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_topic_above_suggested_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_topic_above_footer_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_topic_above_footer_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_post_bottom_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_post_bottom_code);
    }

    if (Discourse.SiteSettings.smart_ad_server_mobile_topic_list_top_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_mobile_topic_list_top_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_mobile_topic_above_post_stream_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_mobile_topic_above_post_stream_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_mobile_topic_above_suggested_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_mobile_topic_above_suggested_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_mobile_topic_above_footer_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_mobile_topic_above_footer_code);
    }
    if (Discourse.SiteSettings.smart_ad_server_mobile_post_bottom_code) {
        _formatIdsArr.push(Discourse.SiteSettings.smart_ad_server_mobile_post_bottom_code);
    }

    $.unique(_formatIdsArr);
}

let data = {
    "topic-list-top": {},
    "topic-above-post-stream": {},
    "topic-above-suggested": {},
    "topic-above-footer": {},
    "post-bottom": {},
};

if (Discourse.SiteSettings.smart_ad_server_network_id) {
    if (!mobileView && Discourse.SiteSettings.smart_ad_server_topic_list_top_code) {
        data["topic-list-top"]["ad_code"] = Discourse.SiteSettings.smart_ad_server_topic_list_top_code;
    }
    if (mobileView && Discourse.SiteSettings.smart_ad_server_mobile_topic_list_top_code) {
        data["topic-list-top"]["ad_mobile_code"] = Discourse.SiteSettings.smart_ad_server_mobile_topic_list_top_code;
    }
    if (!mobileView && Discourse.SiteSettings.smart_ad_server_topic_above_post_stream_code) {
        data["topic-above-post-stream"]["ad_code"] = Discourse.SiteSettings.smart_ad_server_topic_above_post_stream_code;
    }
    if (mobileView && Discourse.SiteSettings.smart_ad_server_mobile_topic_above_post_stream_code) {
        data["topic-above-post-stream"]["ad_mobile_code"] = Discourse.SiteSettings.smart_ad_server_mobile_topic_above_post_stream_code;
    }
    if (!mobileView && Discourse.SiteSettings.smart_ad_server_topic_above_suggested_code) {
        data["topic-above-suggested"]["ad_code"] = Discourse.SiteSettings.smart_ad_server_topic_above_suggested_code;
    }
    if (mobileView && Discourse.SiteSettings.smart_ad_server_mobile_topic_above_suggested_code) {
        data["topic-above-suggested"]["ad_mobile_code"] = Discourse.SiteSettings.smart_ad_server_mobile_topic_above_suggested_code;
    }
    if (!mobileView && Discourse.SiteSettings.smart_ad_server_topic_above_footer_code) {
        data["topic-above-footer"]["ad_code"] = Discourse.SiteSettings.smart_ad_server_topic_above_footer_code;
    }
    if (mobileView && Discourse.SiteSettings.smart_ad_server_mobile_topic_above_footer_code) {
        data["topic-above-footer"]["ad_mobile_code"] = Discourse.SiteSettings.smart_ad_server_mobile_topic_above_footer_code;
    }
    if (!mobileView && Discourse.SiteSettings.smart_ad_server_post_bottom_code) {
        data["post-bottom"]["ad_code"] = Discourse.SiteSettings.smart_ad_server_post_bottom_code;
    }
    if (mobileView && Discourse.SiteSettings.smart_ad_server_mobile_post_bottom_code) {
        data["post-bottom"]["ad_mobile_code"] = Discourse.SiteSettings.smart_ad_server_mobile_post_bottom_code;
    }
}

export default Ember.Component.extend({
    classNames: ['smart-adserver'],
    loadedGoogletag: false,

    network_id: network_id,

    init() {
        let ad_code = data[this.placement]["ad_code"],
            ad_mobile_code = data[this.placement]["ad_mobile_code"];

        this.set('ad_code', data[this.placement]["ad_code"]);
        this.set('ad_mobile_code', data[this.placement]["ad_mobile_code"]);
        this._super();
        if (this.postNumber && Discourse.SiteSettings.smart_ad_server_nth_post_code) {
            let indent = ~~(this.postNumber / Discourse.SiteSettings.smart_ad_server_nth_post_code);

            if (indent > 1 ) {
                ad_code = ad_code + "_" + indent;
                ad_mobile_code = ad_mobile_code + "_" + indent;
            }
        }
        this.set('ad_code', ad_code);
        this.set('ad_mobile_code', ad_mobile_code);

        if (Discourse.SiteSettings.smart_ad_server_refresh_timeout) {
            refreshTimeout = Discourse.SiteSettings.smart_ad_server_refresh_timeout;
        }
    },

    _triggerAds() {
        // Get values after render
        let ad_code = this.ad_code || this.ad_mobile_code;

        loadSmartad().then(function () {
            sas.cmd = sas.cmd || [];

            if (!_sas_loaded) {
                initFormatIds();
                initSas();
                _sas_loaded = true;
            }

            try {
                sas.cmd.push(function() {
                    sas.render(ad_code);

                    if (refreshTimeout) {
                        setInterval(function () {
                            sas.refresh(ad_code);
                        }, refreshTimeout);
                    }
                });
            } catch (ex) {
            }
        });
    },

    didInsertElement() {
        this._super();

        if (!this.get('showAd')) {
            return;
        }

        Ember.run.scheduleOnce('afterRender', this, this._triggerAds);
    },

    checkTrustLevels: function () {
        return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.smart_ad_server_through_trust_level));
    }.property('trust_level'),

    showAd: function () {
        return Discourse.SiteSettings.smart_ad_server_network_id && this.get('checkTrustLevels');
    }.property('checkTrustLevels')
});
